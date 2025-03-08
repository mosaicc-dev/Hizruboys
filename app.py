from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import base64
from bson import ObjectId  # Import ObjectId

from bson.objectid import ObjectId

import os

from trash import analyze_image

app = Flask(__name__)
CORS(app)  # Allow frontend access
NGROK_URL = "https://6552-103-160-194-235.ngrok-free.app"

# Directory to save images temporarily
IMAGE_DIR = "saved_images"
os.makedirs(IMAGE_DIR, exist_ok=True)

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["waste_report"]
complaints_collection = db["complaints"]

@app.route("/posting-complaint", methods=["POST"])
def post_complaint():
    try:
        data = request.json.get("ComplaintInfo")

        if not data:
            return jsonify({"checking": False, "msg": "Invalid request data"}), 400

        # Extract fields
        description = data.get("Description")
        location = data.get("Location")
        photo = data.get("Photo")  # Base64 image
        address = data.get("Address")
        time_issued = datetime.datetime.utcnow()

        if not description or not location or not photo:
            return jsonify({"checking": False, "msg": "All fields are required"}), 400

        # Generate a unique filename
        filename = f"{datetime.datetime.utcnow().timestamp()}.png"

        # Save the image temporarily
        save_base64_image(photo, filename)

        # Generate a public URL using Ngrok
        public_image_url = f"{NGROK_URL}/images/{filename}"
        print("Public Image URL:", public_image_url)

        # Analyze the image
        analysis_result: str = analyze_image(public_image_url)

        if "Yes" in analysis_result:
            current_status = "Approved"
        elif "No" in analysis_result:
            current_status = "Rejected"
        else:
            current_status = "Pending"

        # Insert into MongoDB
        complaint_id = complaints_collection.insert_one({
            "description": description,
            "location": location,
            "photo": photo,  # Store public URL instead of Base64
            "time_issued": time_issued,
            "address": address,
            "clearedUpPhoto": "",
            "status": current_status,
            "analysis_result": analysis_result  # Store analysis result
        }).inserted_id

        return jsonify({"checking": True, "msg": "Complaint submitted successfully", "id": str(complaint_id), "analysis": analysis_result})

    except Exception as e:
        print("Error:", e)
        return jsonify({"checking": False, "msg": "Server error"}), 500

# Function to save Base64 image to a directory
def save_base64_image(base64_string, filename):
    filepath = os.path.join(IMAGE_DIR, filename)

    if "," in base64_string:
        base64_string = base64_string.split(",")[1]

    image_data = base64.b64decode(base64_string)

    with open(filepath, "wb") as f:
        f.write(image_data)
    return filepath

# Serve images from the saved_images folder
@app.route("/images/<filename>")
def get_image(filename):
    return send_from_directory(IMAGE_DIR, filename)


@app.route("/get-complaints", methods=["GET"])
def get_complaints():
    try:
        complaints = list(complaints_collection.find({}, {"_id": 1, "description": 1, "location": 1, "photo": 1, "status": 1,"address": 1, "time_issued": 1}))

        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])  # Convert ObjectId to string for frontend use

        return jsonify({"checking": True, "complaints": complaints})

    except Exception as e:
        print("Error:", e)
        return jsonify({"checking": False, "msg": "Server error"}), 500


@app.route("/get-complaints-approved", methods=["GET"])
def get_complaints_approved():
    try:
        # Fetch only complaints where status is "Approved"
        complaints = list(
            complaints_collection.find(
                {"status": "Approved"},  # Filter condition
                {"_id": 1, "description": 1, "location": 1, "photo": 1, "address": 1, "status": 1, "time_issued": 1}
            )
        )

        for complaint in complaints:
            complaint["_id"] = str(complaint["_id"])  # Convert ObjectId to string for frontend

        return jsonify({"checking": True, "complaints": complaints})

    except Exception as e:
        print("Error:", e)
        return jsonify({"checking": False, "msg": "Server error"}), 500



@app.route("/update-complaint-status", methods=["POST"])
def update_complaint_status():
    try:
        data = request.json
        complaint_id = data.get("complaintId")
        status = data.get("status")

        if not complaint_id or not status:
            return jsonify({"success": False, "message": "Missing complaintId or status"}), 400

        result = complaints_collection.update_one(
            {"_id": ObjectId(complaint_id)}, {"$set": {"status": status}}
        )

        if result.modified_count == 0:
            return jsonify({"success": False, "message": "Complaint not found or status unchanged"}), 404

        return jsonify({"success": True, "message": "Status updated successfully"})

    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "message": "Error updating status", "error": str(e)}), 500

@app.route("/details/<string:complaint_id>", methods=["GET"])
def get_complaint_details(complaint_id):
    try:
        complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})

        if not complaint:
            return jsonify({"success": False, "message": "Complaint not found"}), 404

        # Convert ObjectId to string and return data
        complaint["_id"] = str(complaint["_id"])
        return jsonify(complaint)

    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "message": "Server error", "error": str(e)}), 500

@app.route("/picked-up-garbage", methods=["PUT"])
def update_cleared_up_photo():
    try:
        data = request.json
        complaint_id = data.get("id")
        cleared_up_photo = data.get("clearedUpPhoto")

        if not complaint_id or not cleared_up_photo:
            return jsonify({"checking": False, "msg": "Complaint ID and cleared-up photo are required"}), 400

        # Find the complaint by ID
        complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})

        if not complaint:
            return jsonify({"checking": False, "msg": "Complaint not found"}), 404

        # Update complaint with cleared-up photo and set status to "Picked Up"
        result = complaints_collection.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": {"clearedUpPhoto": cleared_up_photo, "status": "Picked Up"}}
        )

        if result.modified_count == 0:
            return jsonify({"checking": False, "msg": "Failed to update complaint"}), 500

        return jsonify({"checking": True, "msg": "Garbage pickup confirmed successfully"})

    except Exception as e:
        print("Error:", e)
        return jsonify({"checking": False, "msg": "Server error", "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
