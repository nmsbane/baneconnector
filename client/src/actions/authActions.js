import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import axios from "axios";
// Register User

export const registerUser = (userData, history) => dispatch => {
    axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => dispatch(
        {
            type: GET_ERRORS,
            payload: err.response.data
        }
    ))
};

// Login - Get user token
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res => {
            // save to local storage
            const { token } = res.data;
            // set token to local storage
            localStorage.setItem('jwtToken', token);
            // set token to authHeader
            setAuthToken(token);
            // decode token to get user data
            const decoded = jwt_decode(token);
            // set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}

// set loggedIn user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
}

// log user out
export const logoutUser = () => dispatch => {
    // remove token from locastorage
    localStorage.removeItem('jwtToken');
    // remove auth header for future requests
    setAuthToken(false);
    // set the current user to {} which will also set isAuthenticated to false
    dispatch(setCurrentUser({}));
}
