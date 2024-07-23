import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate()
    const [cred, setCred] = useState({email:"", password:""});

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const response = await fetch(`http://127.0.0.1:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({email:cred.email, password:cred.password})
        })
        const json = await response.json()
        console.log(json);
        if(json.success){
            //redirect and save token
            localStorage.setItem('token', json.authToken)
            navigate('/')
            props.showAlert("Account Created Successfully", "success")

        }else{
            props.showAlert("invalid Credentials", "danger")
        }
    }


    const onChange = (e)=>{
        setCred({...cred, [e.target.name]: e.target.value})
    }
    return (
        <div>
            <h2 className='mt-3'>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} value={cred.email}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} value={cred.password} autoComplete="on"/>
                </div>
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login
