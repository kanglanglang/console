// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../../common/api";
import { ITenant } from "./types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@material-ui/core/Grid";
interface IDeleteTenant {
  classes: any;
  deleteOpen: boolean;
  selectedTenant: ITenant;
  closeDeleteModalAndRefresh: (refreshList: boolean) => any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
  });

const DeleteTenant = ({
  classes,
  deleteOpen,
  selectedTenant,
  closeDeleteModalAndRefresh,
}: IDeleteTenant) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [retypeTenant, setRetypeTenant] = useState("");

  useEffect(() => {
    if (deleteLoading) {
      api
        .invoke(
          "DELETE",
          `/api/v1/namespaces/${selectedTenant.namespace}/tenants/${selectedTenant.name}`
        )
        .then(() => {
          setDeleteLoading(false);
          setDeleteError("");
          closeDeleteModalAndRefresh(true);
        })
        .catch((err) => {
          setDeleteLoading(false);
          setDeleteError(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteLoading]);

  const removeRecord = () => {
    if (retypeTenant !== selectedTenant.name) {
      setDeleteError("Tenant name is not correct");
      return;
    }
    setDeleteLoading(true);
  };

  return (
    <Dialog
      open={deleteOpen}
      onClose={() => {
        setDeleteError("");
        closeDeleteModalAndRefresh(false);
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Tenant</DialogTitle>
      <DialogContent>
        {deleteLoading && <LinearProgress />}
        <DialogContentText id="alert-dialog-description">
          To continue please type <b>{selectedTenant.name}</b> in the box.
          <Grid item xs={12}>
            <InputBoxWrapper
              id="retype-tenant"
              name="retype-tenant"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setRetypeTenant(event.target.value);
              }}
              label=""
              value={retypeTenant}
            />
          </Grid>
          {deleteError !== "" && (
            <React.Fragment>
              <br />
              <Typography
                component="p"
                variant="body1"
                className={classes.errorBlock}
              >
                {deleteError}
              </Typography>
            </React.Fragment>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDeleteError("");
            closeDeleteModalAndRefresh(false);
          }}
          color="primary"
          disabled={deleteLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={removeRecord}
          color="secondary"
          autoFocus
          disabled={retypeTenant === ""}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles(styles)(DeleteTenant);
