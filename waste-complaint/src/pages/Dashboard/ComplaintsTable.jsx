import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  TextField,
  styled,
  TableContainer,
  Button,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../library/helper.js";
import "./ComplaintsTable.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableContainer = styled(TableContainer)({
  marginTop: "10px",
  background: "#fff",
  padding: "10px",
  borderRadius: "10px",
});

const FilterContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "10px",
  borderBottom: "1px solid #ccc",
});

const ComplaintsTable = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-complaints`);
      if (response.data.checking) {
        setComplaintsData(response.data.complaints);
      } else {
        console.error("Error fetching complaints:", response.data.msg);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/update-complaint-status`, {
        complaintId: id,
        status: status,
      });

      if (response.data.success) {
        setComplaintsData((prevData) =>
          prevData.map((complaint) =>
            complaint._id === id ? { ...complaint, status: status } : complaint
          )
        );
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "photo",
        headerName: "Image",
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <Avatar
            src={params.row.photo || "/default-image.jpg"}
            alt="Complaint"
            sx={{ width: 50, height: 50, borderRadius: "8px" }}
          />
        ),
      },
      {
        field: "location",
        headerName: "Location",
        width: 200,
        sortable: true,
      },
      {
        field: "description",
        headerName: "Description",
        width: 300,
        sortable: false,
      },
      {
        field: "time_issued",
        headerName: "Date & Time",
        width: 180,
        sortable: true,
        renderCell: (params) =>
          new Date(params.row.time_issued).toLocaleString(),
      },
      {
        field: "status",
        headerName: "Status",
        width: 130,
        sortable: true,
        renderCell: (params) => (
          <Typography
            sx={{
                marginTop: 2,
              color:
                params.row.status === "Approved"
                  ? "green"
                  : params.row.status === "Rejected"
                  ? "red"
                  : "orange",
              fontWeight: "bold",
            }}
          >
            {params.value || "Pending"}
          </Typography>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <CheckCircleIcon
              variant="contained"
              color="success"
              fontSize="large"
              sx={{marginTop: 1}}
              onClick={() => handleUpdateStatus(params.row._id, "Approved")}
              disabled={params.row.status === "Approved"}
            />
            <DeleteIcon
              color="error"
              fontSize="large"
              sx={{marginTop: 1}}
              onClick={() => handleUpdateStatus(params.row._id, "Rejected")}
              disabled={params.row.status === "Rejected"}
            />
          </Box>
        ),
      },
    ],
    []
  );

  const filteredComplaints = useMemo(() => {
    return complaintsData.filter(
      (complaint) =>
        complaint.location.toLowerCase().includes(searchText.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, complaintsData]);

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        maxWidth: "95%",
        borderRadius: 2,
        backgroundColor: "#fff",
        overflow: "hidden",
        border: 1,
        borderColor: "#e8e8e8",
        boxShadow: 4,
      }}
    >
      <FilterContainer>
        <Typography
          variant="h5"
          sx={{ fontSize: { xs: 15 }, paddingRight: 3 }}
        >
          Complaints
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          label="Search by location or description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </FilterContainer>

      <StyledTableContainer component={Paper}>
        <Box>
          <DataGrid
            rows={filteredComplaints}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            components={{
              Toolbar: GridToolbar,
            }}
            disableSelectionOnClick
            disableColumnMenu
            style={{ height: 650, width: "100%" }}
          />
        </Box>
      </StyledTableContainer>
    </Box>
  );
};

export default ComplaintsTable;
