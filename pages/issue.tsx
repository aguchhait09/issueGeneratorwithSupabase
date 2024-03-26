import {
  deleteIssueApi,
  issueData,
  issueDataInsert
} from "@/api/functions/issue.api";
import DataGridTable from "@/components/Table/DataGridTable";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { Box, Button, DialogActions, Typography, styled } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import MuiModalWrapper from "@/ui/Modal/MuiModalWrapper";
import { useState } from "react";
import CustomInput from "@/ui/Inputs/CustomInput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { IssueData } from "@/interface/issueData.interface";
import { KeyOff } from "@mui/icons-material";
import { indexOf } from "lodash";

const StyledBox = styled(Box)`
  margin: 10px;
`;

const issueEntrySchema = yup.object().shape({
  project_name: yup.string().trim().required("Project Name Required"),
  issue_type: yup.string().trim().required("Issue Type Required."),
  summary: yup.string().trim().required("Summary Required."),
  description: yup.string().trim().required("Description Required.")
});

const issue = () => {
  const { mutate, data: inputIssue } = useMutation({
    mutationFn: issueDataInsert
  });

  // console.log("issueInput", inputIssue);
  const { mutate: deleteItem } = useMutation({
    mutationFn: deleteIssueApi
  });

  const handleDelete = (data: string) => {
    deleteItem(data, {
      onSuccess: () => {
        toast.success("Item delete successfully!!!");
      }
    });
  };

  const { data: issueTable, error: issueError } = useQuery({
    queryKey: ["issueRows", inputIssue],
    queryFn: issueData
  });

  console.log("issues", issueTable?.issueTable);

  // Datagrid Columns and Rows
  const columns: GridColDef[] = [
    { field: "project_name", headerName: "Project Name", width: 200 },
    { field: "issue_type", headerName: "Issue Type", width: 200 },
    { field: "summary", headerName: "Summary", width: 200 },
    {
      field: "description",
      headerName: "Description",
      width: 250
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(params?.id as string)}
        >
          Delete
        </Button>
      )
    }
  ];

  // Modal
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen((prev) => !prev);
  };

  // UseForm
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(issueEntrySchema),
    mode: "all"
  });

  const onSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Issue created successfully!!!");
        setOpen((prev) => !prev);
      }
    });
  };

  return (
    <DashboardLayout>
      <StyledBox>
        <Button
          variant="contained"
          color="success"
          sx={{ float: "right" }}
          onClick={() => setOpen(true)}
        >
          Create Issue <AddIcon fontSize="small" />
        </Button>
      </StyledBox>

      <StyledBox>
        <DataGridTable
          columns={columns}
          rows={(issueTable?.issueTable as IssueData[]) ?? ""}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      </StyledBox>
      <MuiModalWrapper title="Create Issue" open={open} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography>Project Name</Typography>
          <CustomInput {...register("project_name")} />
          <Typography>Issue Type</Typography>
          <CustomInput {...register("issue_type")} />
          <Typography>Summary</Typography>
          <CustomInput {...register("summary")} />
          <Typography>Description</Typography>
          <CustomInput {...register("description")} />
          <DialogActions>
            <Button variant="contained" color="error" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" color="success" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </MuiModalWrapper>
    </DashboardLayout>
  );
};

export default issue;
