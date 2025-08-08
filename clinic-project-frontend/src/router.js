// router.js
import { createBrowserRouter } from 'react-router-dom';
import SignupForm from './user/SignupForm';
import LoginForm from './user/LoginForm';
import DoctorList from './user/DoctorList';
import AppointmentList from './user/AppointmentList';
import BookAppointment from './user/BookAppointment';
import CreateDoctor from './user/CreateDoctor';
import UserProfile from './user/UserProfile';
import ManageDoctors from './user/ManageDoctors';
import Layout from './layout'; 
// import AllAppointments from "./user/AllAppoinments";

const router = createBrowserRouter([

  // { path: '/', element: <SignupForm /> },
  { path: '/signup', element: <SignupForm /> },
  { path: '/', element: <LoginForm /> },

  {
    path: '/',
    element: <Layout />, 
    children: [
      { path: 'doctors', element: <DoctorList /> },
      { path: 'appointments', element: <AppointmentList /> },
      { path: 'book/:doctorName', element: <BookAppointment /> },
      { path: 'create-doctor', element: <CreateDoctor /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'manage-doctors', element: <ManageDoctors /> },
      
      // { path: 'appointments', element: <AllAppointments /> },
    ]
  }
]);

export default router;
