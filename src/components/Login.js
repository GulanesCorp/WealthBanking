import React from 'react';
import { Link } from 'react-router-dom';
import { useBankContext } from '../BankContext/BankAppContext';
import Navbar from './Navbar';

const Login = () => {
  const {
    handleChangeLogin,
    handleLogin,
    email,
    password,
    confirmFields,
    buttonLoader,
    type,
    msg,
  } = useBankContext();

  return (
    <div className='min-h-screen  Apps flex flex-col'>
      <Navbar background='bg-black opacity-80' />
      <div className='h-screen flex flex-col  justify-center items-center'>
        <div className='w-10/12 sm:w-8/12 md:w-5/12 lg:w-4/12 flex flex-col max-w-2xl  gap-1  transition ease-in-out duration-500'>
          <form
            className='py-6 px-8 cap  bg-contain rounded-xl shadow-2xl animate-slideIn flex flex-col gap-2 lg:gap-4 items-center glass2 '
            onSubmit={handleLogin}
          >
            <p className='text-xl text-gray-800'> Login</p>

            {type ? (
              <p className='text-red-800 animate-slideIn p-2 '>{msg}</p>
            ) : null}

            <input
              type='email'
              placeholder='john@example.com'
              name='email'
              className='my-2 block w-full py-2 px-2 focus:outline-none text-black rounded-lg focus:ring-2 border-green-500 focus:ring-green-500 focus:border-transparent text-sm'
              value={email}
              onChange={handleChangeLogin}
            />

            <input
              type='password'
              placeholder='Enter Password'
              name='password'
              className='my-2 block w-full py-2 px-2  focus:outline-none border-green-500 text-black rounded-lg focus:ring-2 focus:ring-green-500 text-sm focus:border-transparent'
              value={password}
              onChange={handleChangeLogin}
            />

            <button
              className={` ${
                confirmFields ? 'bg-green-200' : ' bg-green-700 '
              } text-white cap text-xs  w-4/12 md:text-base rounded-lg text-center py-2 text-white transition ease-linear duration-1000`}
              disabled={confirmFields}
            >
              {buttonLoader ? 'Verifying...' : 'Login'}
            </button>
            {/* <Link className='text-sm' to='/resetPassword'>
            Forgot Password{' '}
          </Link> */}

            <p className=' flex gap-3 text-sm text-gray-800'>
              Need An Account {''}{' '}
              <Link className='text-blue-600 text-sm' to='/create'>
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
