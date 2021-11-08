import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  useRef,
} from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { generateAccNums, createUserStore } from '../components/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { isLoggedIn, isLoggedOut } from '../actions';

const BankAppContext = createContext();

const BankAppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [register, setRegister] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });

  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const [accounts, setAccounts] = useState([]);

  // const [loading, setLoading] = useState(true);
  // const [users, setUsers] = useState({});
  const [userDetails, setUserDetails] = useState({});

  // const [resetEmail, setResetEmail] = useState('');
  const [confirmFields, setConfirmFields] = useState(true);

  const [alert, setAlert] = useState({
    type: false,
    msg: '',
  });

  const [transferError, setTransferError] = useState({
    type: true,
    msg: '',
  });

  const [transVal, setTransVal] = useState('');
  const [loanAlert, setLoanAlert] = useState({
    type: true,
    msg: '',
  });

  const [closeAlert, setCloseAlert] = useState({
    type: true,
    msg: '',
  });

  const [popUp, setpopUp] = useState(false);

  const [selected, setSelected] = useState({
    type: 1,
  });

  // const [buttonLoader, setButtonLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [withdrawal, setWithdrawal] = useState(0);

  const history = useHistory();

  const transferAmount = useRef();

  const loanRef = useRef();
  const closeUser = useRef();
  const closeUserPin = useRef();

  const data = 'wealth';

  const collectionRef = collection(db, 'Accounts');

  //clearAlert

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert({ ...alert, type: false });
      setCloseAlert({ ...closeAlert, type: false });
      setLoanAlert({ ...loanAlert, type: false });
      setTransferError({ ...transferError, type: false });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert, closeAlert, transferError, loanAlert]);

  //To order by timestamp
  useEffect(() => {
    const q = query(collection(db, 'Accounts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  }, []);

  //get all documents in a collection

  useEffect(() => {
    onSnapshot(collection(db, 'Accounts'), (snapshot) => {
      setAccounts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  // get currrent logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // setUsers(currentUser);
      dispatch(isLoggedIn(currentUser));
    });

    return unsubscribe;
  }, [dispatch]);

  const authenticated = useSelector((state) => state.Authentication);

  //Get current signed in  user's firestore
  useEffect(() => {
    if (authenticated) {
      setUserDetails(accounts.find((item) => item.id === authenticated.uid));
    }
  }, [accounts, authenticated]);

  useEffect(() => {
    setTotal(
      userDetails?.transactions
        ?.map((mov) => Number(mov.amount))
        .reduce((arr, mov) => arr + mov, 0)
    );
  }, [userDetails]);

  useEffect(() => {
    setDeposit(
      userDetails?.transactions
        ?.map((mov) => Number(mov.amount))
        .filter((mov) => mov > 0)
        .reduce((arr, mov) => arr + mov, 0)
    );
  }, [userDetails]);

  useEffect(() => {
    setWithdrawal(
      Math.abs(
        userDetails?.transactions
          ?.map((mov) => Number(mov.amount))
          .filter((mov) => mov < 0)
          .reduce((arr, mov) => arr + mov, 0)
      )
    );
  }, [userDetails]);

  // useEffect(() => {
  //   if (selected.type === 1) {
  //     setUserDetails(accounts.find((item) => item.id === authenticated.uid));
  //   }
  // }, [accounts, authenticated, selected.type]);

  // useEffect(() => {
  //   if (selected.type === 2) {
  //     setUserDetails({
  //       ...userDetails,
  //       transactions: userDetails?.transactions?.filter(
  //         (item) => item.amount > 0
  //       ),
  //     });
  //   }
  // }, [userDetails, selected.type]);

  // useEffect(() => {
  //   if (selected.type === 3) {
  //     setUserDetails({
  //       ...userDetails,
  //       transactions: userDetails?.transactions?.filter(
  //         (item) => item.amount < 0
  //       ),
  //     });
  //   }
  // }, [userDetails, selected.type]);

  //Login
  useEffect(() => {
    if (login.email !== '' && login.password !== '') {
      setConfirmFields(false);
    } else {
      setConfirmFields(true);
    }
  }, [login.email, login.password]);

  const errorChecker = ({ code }) => {
    if (code === 'auth/email-already-in-use') {
      setAlert({ type: true, msg: 'Email Already In Use' });
    } else if (code === 'auth/network-request-failed') {
      setAlert({ type: true, msg: 'Please Check Your Network Connection...' });
    } else if (code === 'auth/weak-password') {
      setAlert({
        type: true,
        msg: 'Password should be at least 6 characters',
      });
    } else if (code === 'auth/wrong-password') {
      setAlert({
        type: true,
        msg: 'Wrong Credentials',
      });
    } else if (code === 'auth/user-not-found') {
      setAlert({
        type: true,
        msg: "Account doesn't exist ",
      });
    }
  };
  // Register;
  useEffect(() => {
    if (
      register.email !== '' &&
      register.password !== '' &&
      register.firstname !== '' &&
      register.lastname
    ) {
      setConfirmFields(false);
    } else {
      setConfirmFields(true);
    }
  }, [
    register.email,
    register.firstname,
    register.lastname,
    register.password,
  ]);

  const selectChange = (e) => {
    setSelected({ ...selected, type: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const data = await createUserWithEmailAndPassword(
        auth,
        register.email,
        register.password
      );

      const { uid } = data.user;

      // dispatch(
      //   logIn({
      //     ...data,
      //   })
      // );

      const docRef = doc(collectionRef, uid);
      const payload = {
        name: register.firstname + ' ' + register.lastname,
        id: uid,
        transactions: [
          {
            Depositor: 'WealthBank',
            account: 'Bonus',
            time: new Date().toISOString(),
            amount: 1000,
          },
        ],
        timestamp: serverTimestamp(),
        accountNumber: generateAccNums(),
      };

      await setDoc(docRef, payload);

      history.push('/creating');

      const myStore = await createUserStore(uid);
      setUserDetails(myStore.data());

      setRegister({
        email: '',
        password: '',
      });

      setConfirmFields(true);

      setTimeout(() => {
        history.push('/profile');
      }, 4000);
    } catch (error) {
      errorChecker(error);
      console.log(error);
      setConfirmFields(false);
    }
  };

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await signInWithEmailAndPassword(
        auth,
        login.email,
        login.password
      );

      console.log(data.user.uid);

      // dispatch(
      //   logIn({
      //     email: data.user.email,
      //     uid: data.user.uid,
      //     displayName: data.user.displayName,
      //     photoUrl: data.user.photoURL,
      //   })
      // );

      // setButtonLoader(true);

      history.push('/loginState');

      const myStore = await createUserStore(data.user.uid);
      setUserDetails(myStore.data());

      setLogin({
        email: '',
        password: '',
      });

      setConfirmFields(true);
      setTimeout(() => {
        // setButtonLoader(false);
        history.push('/profile');
      }, 1500);
    } catch (error) {
      console.log(error.message);
      errorChecker(error);
      setConfirmFields(false);
      // setAlert({
      //   type: true,
      //   msg: 'Failed To Login Try Again!!',
      // });
      // setButtonLoader(true);

      // setTimeout(() => {
      //   setButtonLoader(false);
      // }, 3000);
    }
  };

  const handleLogout = async () => {
    history.push('/Logout');

    setTimeout(() => {
      dispatch(isLoggedOut());
      signOut(auth);
      history.push('/login');
    }, 3000);
  };

  const handleModal = () => {
    setIsOpen(!isOpen);
  };
  const transferCheck = (find, user, transfer, total) => {
    if (find === undefined) {
      return "user doesn't exist";
    }
    if (find.accountNumber === user.accountNumber) {
      return "You can't transfer to self";
    } else if (Number(transfer.current.value) > total) {
      return 'Insufficient Account';
    } else {
      return 'Check Network Connection';
    }
  };

  const handleTransfers = async (e) => {
    e.preventDefault();
    const findAccount = accounts.find(
      (acc) => acc.accountNumber === Number(transVal)
    );

    if (
      findAccount &&
      findAccount.accountNumber !== userDetails.accountNumber &&
      Number(transferAmount.current.value) < total
    ) {
      const recieverRef = doc(db, 'Accounts', findAccount.id);

      const transferRef = doc(db, 'Accounts', authenticated.uid);

      //updating an array in a document field

      const recieverPayload = [
        ...findAccount.transactions,
        {
          Depositor: userDetails.name,
          account: userDetails.accountNumber,
          time: new Date().toISOString(),
          amount: Number(transferAmount.current.value),
        },
      ];

      const depositorPayload = [
        ...userDetails.transactions,
        {
          Depositor: findAccount.name,
          account: findAccount.accountNumber,
          time: new Date().toISOString(),
          amount: -transferAmount.current.value,
        },
      ];

      await updateDoc(recieverRef, {
        transactions: recieverPayload,
      });

      await updateDoc(transferRef, {
        transactions: depositorPayload,
      });
      setTransVal('');
      transferAmount.current.value = '';
      setpopUp(false);
    } else {
      setTransferError({
        type: true,
        msg: transferCheck(findAccount, userDetails, transferAmount, total),
        // msg:
        //   findAccount.accountNumber == userDetails.accountNumber
        //     ? "You can't transfer to self"
        //     : Number(transferAmount.current.value) > total
        //     ? 'Insufficient Account'
        //     : 'Check Network Connection',
      });
    }
  };

  const handleLoans = async (e) => {
    e.preventDefault();

    if (deposit > 0.5 * total && Number(loanRef.current.value) < total * 2) {
      const loanReference = doc(db, 'Accounts', authenticated.uid);

      //updating an array in a document field

      const loanPayload = [
        ...userDetails.transactions,
        {
          Depositor: 'WealthBank',
          account: 'Management',
          time: new Date().toISOString(),
          amount: Number(loanRef.current.value),
        },
      ];

      await updateDoc(loanReference, {
        transactions: loanPayload,
      });
      loanRef.current.value = '';
      setpopUp(false);
    } else {
      setLoanAlert({
        type: true,
        msg:
          Number(loanRef.current.value) > total * 2
            ? "You aren't qualified for this Loan"
            : 'Check Network Connection',
      });
    }
  };

  const handleCloseAccount = async (e) => {
    e.preventDefault();

    try {
      if (
        userDetails.accountNumber === Number(transVal) &&
        closeUserPin.current.value === authenticated.email
      ) {
        await deleteDoc(doc(collectionRef, authenticated.uid));
        authenticated.delete();

        // users.delete();
      } else {
        setCloseAlert({
          type: true,
          msg:
            userDetails.accountNumber !== Number(transVal) &&
            closeUserPin.current.value !== authenticated.email
              ? 'Wrong Credentials'
              : 'Check Network connection',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BankAppContext.Provider
      value={{
        data,
        handleLogin,
        handleSignup,
        register,
        ...login,
        ...alert,
        popUp,
        setpopUp,
        handleChangeLogin,
        handleChangeRegister,
        handleModal,
        isOpen,
        handleLogout,
        userDetails,
        total,
        accounts,
        transferAmount,
        transVal,
        handleTransfers,
        deposit,
        withdrawal,
        loanRef,
        closeUser,
        closeUserPin,
        handleLoans,
        handleCloseAccount,
        confirmFields,
        transferError,
        loanAlert,
        closeAlert,
        authenticated,
        setTransVal,
        selected,
        selectChange,
      }}
    >
      {children}
    </BankAppContext.Provider>
  );
};

const useBankContext = () => {
  return useContext(BankAppContext);
};

export { useBankContext, BankAppProvider };
