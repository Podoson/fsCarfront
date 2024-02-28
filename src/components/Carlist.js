import React, { useEffect, useState } from "react";
import {SERVER_URL} from '../constants.js'
import { DataGrid, GridToolbarContainer, GridToolbarExport, gridClasses } from "@mui/x-data-grid";
import { IconButton, Snackbar, Stack } from "@mui/material";
import AddCar from "./AddCar.js";
import EditCar from "./EditCar.js";
import DeleteIcon from '@mui/icons-material/Delete';


function Carlist(){
    const token = sessionStorage.getItem("jwt");
    const [cars, setCars] = useState([]);
    const columns = [
        {field: 'brand', headerName: 'Brand', width: 200},
        {field: 'model', headerName: 'Model', width: 200},
        {field: 'color', headerName: 'Color', width: 200},
        {field: 'year', headerName: 'Year', width: 150},
        {field: 'price', headerName: 'Price', width: 150},
        {
            field: '_links.car.href',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: row => <EditCar data={row} updateCar={updateCar} />
        },
        {
            field: '_links.self.href',
            headerName: '',
            sortable: false,
            filterable: false,
            renderCell: row =>
                <IconButton onClick={() => onDelClick(row.id)}>
                    <DeleteIcon color="error" />
                </IconButton>
        }
    ]

    const [open, setOpen] = useState(false);

    const fetchCars = () => {
        fetch(SERVER_URL + 'api/cars', {
            headers: {'Authorization': token}
        })
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err));
    }

    const onDelClick = (url) => {
        if (window.confirm("Are you sure to delete ?")){
            fetch(url, {
                method: 'DELETE',
                headers: {'Authorization': token}
            })
            .then(response => {
                if(response.ok){
                    fetchCars();
                    setOpen(true);
                }
                else{
                    alert('Something went wrong!');
                }
            })
            .catch(err => console.error(err))
        }
    }

    const addCar = (car) => {
        fetch(SERVER_URL + 'api/cars',
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(car)
        })
        .then(response => {
            if (response.ok){
                fetchCars();
            }
            else{
                alert('Something went wrong');
            }
        })

        .catch(err => console.log(err));

    }

    const updateCar = (car, link) => {
        fetch(link,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(car)
            }
        )
        .then(r => {
            if(r.ok){
                fetchCars();
            }
            else{
                alert('Something went wrong!');
            }
        }
        )
        .catch(err => console.error(err))
    }


    useEffect(() => {
        fetchCars();
    }, []);

    function CustomToolbar(){
        return(
            <GridToolbarContainer className={gridClasses.toolbarContainer}>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }


    return(
        <React.Fragment>

            <Stack m={2} >
                <AddCar addCar={addCar} />
            </Stack>
            

            <DataGrid
                rows={cars}
                columns={columns}
                disableRowSelectionOnClick={true}
                getRowId={row => row._links.self.href}
                components={{Toolbar: CustomToolbar}}
                />

            <Snackbar
                open = {open}
                autoHideDuration = {2000}
                onClose = {() => setOpen(false)}
                message = "Car deleted"
                />
            
        </React.Fragment>
    );
}

export default Carlist;