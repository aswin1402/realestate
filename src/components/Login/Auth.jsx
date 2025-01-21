import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPI, registerAPI } from '../../services/allAPI';
import './auth.css';
import { Link } from 'react-router-dom';
import { LoginResponseContext } from '../../ContextAPI/ResponseContex';


function Auth({ closeAuthModal }) {
  const {LoginResponse,setLoginResponse}=useContext(LoginResponseContext)
  
  const [isRegisterForm, setIsRegisterForm] = useState(false); 
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      toast.info('Please fill all fields');
    } else {
      setIsLoading(true);
      try {
        const result = await registerAPI(userData);
        if (result.status === 200) {
          toast.success(`${result.data.name} registration successful`);
          setIsRegisterForm(false); 
          setUserData({ name: '', email: '', password: '' });
        } else {
          toast.error(result.response.data);
        }
      } catch (error) {
        toast.error('Error occurred during registration');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;
    if (!email || !password) {
      toast.info('Please fill all fields');
    } else {
      setIsLoading(true);
      try {
        const result = await loginAPI({ email, password });
        if (result.status === 200) {
          toast.success(`${result.data.name} login successful`);
          sessionStorage.setItem('users', JSON.stringify(result.data.user));
          sessionStorage.setItem('token', result.data.token);
        setLoginResponse(result)
          closeAuthModal(); 
          setUserData({ email: '', password: '' });
        } else {
          toast.error(result.response.data);
        }
      } catch (error) {
        toast.error('Error occurred during login');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-container">
     
      <div className="container w-25">
      <i onClick={closeAuthModal} class="fa-solid fa-arrow-left btn text-light"></i>
        <div className="card-shadow p-5" style={{ background:"rgba(176, 169, 169, 0.5) " ,borderRadius:"20px" }}>
      
          <h5 className="fw-bolder text-warning">
            {isRegisterForm ? 'SIGN UP YOUR ACCOUNT' : 'SIGN IN YOUR ACCOUNT'}
          </h5>
          <Form
            onSubmit={isRegisterForm ? handleRegister : handleLogin}
            className="mt-4 text-dark"
          >
            {isRegisterForm && (
              <Form.Group className="mb-3" controlId="formName">
                <Form.Control
                  type="text"
                  placeholder="Enter Your Name"
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  value={userData.name}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                value={userData.email}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Enter Your Password"
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                value={userData.password}
              />
            </Form.Group>

            <button type="submit" className="btn btn-warning w-100" disabled={isLoading}>
              {isLoading ? 'Loading...' : isRegisterForm ? 'Register' : 'Login'}
            </button>
          </Form>

          <p className="text-light fw-bolder mt-3">
            {isRegisterForm ? (
              <>
                Already have an account?{' '}
                <span
                  style={{ textDecoration: 'none', color: 'orange', cursor: 'pointer' }}
                  onClick={() => setIsRegisterForm(false)}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                New user?{' '}
                <span
                  style={{ textDecoration: 'none', color: 'orange', cursor: 'pointer' }}
                  onClick={() => setIsRegisterForm(true)}
                >
                  Register
                </span>
              </>
            )}
          </p>
        </div>
      </div>
      <ToastContainer autoClose={2000} theme="colored" position="top-center" />
    </div>
  );
}

export default Auth;
