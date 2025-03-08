from groq import Groq
import os

# Initialize Groq API client
api_key = "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"
client = Groq(api_key=api_key)

# Function to analyze an uploaded image
def analyze_image(image_url):
    prompt_text = (
        "Analyze this image and determine if it contains garbage or not. "
        "If it does, respond with 'Yes!' followed by a one-sentence description of the garbage, "
        "including specific objects (e.g., plastic bottles, paper, food waste, metal cans) and its overall condition (e.g., mixed, recyclable, hazardous, organic). "
        "If the image does not contain garbage, respond with 'No!' followed by a one-sentence description of what is in the image instead."
    )

    completion = client.chat.completions.create(
        model="llama-3.2-11b-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ]
            }
        ],
        temperature=0.7,  # Reduce randomness for better accuracy
        max_tokens=1024,
        top_p=1,
        stream=False
    )

    return completion.choices[0].message.content



# # Get user input for image URL
# image_url = input("Enter the image URL to analyze: ")
#
# # Call function and display result
# result = analyze_image(image_url)
# print("\nAnalysis Result:\n", result)
