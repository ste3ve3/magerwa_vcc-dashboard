import { Grid, Box, Stack, Button, TextField, Typography, AppBar, Toolbar, IconButton, Card, Divider } from '@mui/material';
import { API, useFetcher } from 'api';
import React from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import { connect } from 'react-redux';
import { deleteCar, editCar, getAllCars } from 'store/actions/cars';
import DataWidget from 'components/Global/DataWidget';
import DatePickerValue from 'components/Global/DatePicker';
import TimePickerValue from 'components/Global/TimePicker';
import LaunchIcon from '@mui/icons-material/Launch';
import Sidebar from 'components/Global/Sidebar';
import IosSwitch from 'components/extended/IosSwitch';
import CarLoaders from 'components/cards/Skeleton/CarLoaders';
import ClearedCard from 'components/cards/ClearedCard';
import FullScreenModel from 'components/Global/FullScreenModel';
import FeatureLabel from './elements/FeatureLabel';
import SummarizeIcon from '@mui/icons-material/Summarize';

const initFormData = {
    auctionDate: '',
    auctionTime: '',
    auctionLocation: '',
    locationMap: '',
    contactPhone1: '',
    contactPhone2: '',
    contactEmail: '',
    isPublic: '',
};

const initState = { loading: false, error: null };

const ClearedPage = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const [formData, setFormData] = useState(initFormData);
    const [state, setState] = useState(initState);
    const [currentCar, setCurrentCar] = useState(null);
    const [moveCarId, setMoveCarId] = useState(null)

    const { data, isError, isLoading } = useFetcher('/registercar?cleared=true&perPage=1000000');

    const { registeredCars } = useMemo(() => {
        if (data?.data?.length) {
          return { registeredCars: data?.data };
        }
        return { registeredCars: [] };
      }, [data?.data]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSpecialChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOpenSidebar = () => {
        setOpenSidebar(true);
    };
    const handleCloseSidebar = () => {
        if (state.loading) return;
        setOpenSidebar(false);
        setState(initState);
    };

    const [openFullModal, setOpenFullModal] = React.useState(false);

    const handleClickOpenFullModal = () => {
        setOpenFullModal(true);
    };

    const handleCloseFullModal = () => {
        setOpenFullModal(false);
        setCurrentCar(null);
    };

    const handleCarClearance = async (id) => {
        const result = await toast.promise(
            API.patch(`/registercar/carClearance?carId=${id}`),
            {
                loading: `Clearing car, please wait...`,
                success: `Car cleared successfully!`,
                error: `Something went wrong while clearing this car, please try again!`
            },
            { position: 'top-center' }
        );
        editCar(id)
      }; 
 

    const handleDeleteCar = async (id) => {
        await toast.promise(
            API.delete(`/registercar?carId=${id}`),
            {
                loading: `Deleting car, please wait...`,
                success: `Car deleted successfully!`,
                error: `Something went wrong while deleting this car, please try again!`
            },
            { position: 'top-center' }
        );
        deleteCar(id)
      };

    return (
        <div>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h3">Cleared Cars</Typography>
                <Button
                    sx={{ mt: 2 }}
                    component="a"
                    variant="outlined"
                    href="/content/report"
                    color="secondary"
                    startIcon={<SummarizeIcon />}
                    >
                    Cleared Cars Report
                </Button>
            </Stack>
            <DataWidget
                title="Registered cars"
                isLoading={isLoading && !registeredCars.length}
                isError={isError && !registeredCars.length}
                isEmpty={!registeredCars.length}
                customLoaders={<CarLoaders />}
            >
                <Grid container spacing={3} sx={{ my: 1 }}>
                    {registeredCars.map((registeredCar, index) => {
                        return (
                            <ClearedCard
                                car={registeredCar}
                                handlePreview={() => {
                                    handleClickOpenFullModal()
                                    setCurrentCar(registeredCar);
                                }}
                                onClearance={handleCarClearance}
                                onDelete={handleDeleteCar}
                                onMove={(id) => {
                                    setMoveCarId(id)
                                    handleOpenSidebar()
                                }}
                            />
                        );
                    })}
                </Grid>
            </DataWidget>
            <FullScreenModel open={openFullModal} handleClose={handleCloseFullModal}>
                <AppBar sx={{ position: 'sticky', background: '#55BDB3' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseFullModal}
                        aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, color: "white" }} variant="h2" component="div">
                            {currentCar?.carName} owned by {currentCar?.ownedBy.names}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={0} padding={3}>
                    <Grid item xs={8}>
                        <img src={currentCar?.carImage} alt="car" width="100%"/>
                        <Box>
                            <Typography variant="h3" color="secondary" marginBottom={3} marginTop={4} fontWeight='bold'>Features</Typography>
                            <Stack direction="row" gap={2} sx={{ flexWrap: 'wrap' }}>
                                {
                                    currentCar?.features?.map((feature, index) => {
                                        return (
                                        <Box key={index}>
                                            <FeatureLabel labelName={feature}/>
                                        </Box>  
                                        )
                                    })
                                }
                            </Stack>
                        </Box>
                    </Grid>
                <Grid item xs={4}>
                     
                    <Box
                    sx={{
                        paddingLeft: 3
                    }}>
                        <Typography 
                        variant="body1" 
                        color="initial"
                        sx={{
                            border: "1px solid #55BDB3",
                            padding: 1,
                            color: "#55BDB3",
                            textAlign: "center",
                            fontWeight: "bold",
                            borderRadius: 1
                        }}
                        >
                            {parseInt(currentCar?.carPrice).toLocaleString()} Rwf
                        </Typography> 
                        <Card
                        sx={{
                            background: '#F0F8F8',
                            marginTop: 4,
                            padding: 3,
                        }}
                        >
                            <Box>
                                <Typography variant="body1" fontWeight="bold" color="initial">Car Details</Typography>
                                <Stack gap={1} marginTop={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Brand</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.brand}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Model</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.model}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Condition</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.condition}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Year</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.year}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Body Type</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.bodyType}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Seats</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.passengerCapacity} People</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Exterior Color</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.exteriorColor}</Typography>
                                    </Stack>
                                    <Divider color="initial" sx={{ marginTop: 1 }}/>
                                </Stack>
                            </Box>

                            <Box sx={{ marginTop: 4 }}>
                                <Typography variant="body1" fontWeight="bold" color="initial">Engine</Typography>
                                <Stack gap={1} marginTop={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Fuel Type</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.fuelType}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Mileage</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.mileage} km</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Trasmission</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.transmission}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Drivetrain</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.drivetrain}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Power</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.power} hp</Typography>
                                    </Stack>
                                    <Divider color="initial" sx={{ marginTop: 1 }}/>
                                </Stack>
                            </Box>

                            <Box sx={{ marginTop: 4 }}>
                                <Typography variant="body1" fontWeight="bold" color="initial">Dimension</Typography>
                                <Stack gap={1} marginTop={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Length</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.length} mm</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Width</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.width} mm</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Height</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.height} mm</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" color="initial">Cargo Volume</Typography>
                                        <Typography variant="body2" color="initial" fontWeight="bold">{currentCar?.cargoVolume} L</Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                            
                            
                        </Card>
                    </Box>
                    </Grid>
                </Grid>
            </FullScreenModel>
        </div>
    );
};

export default ClearedPage;
