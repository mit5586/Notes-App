import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const navigate = useNavigate()
    const [cred, setCred] = useState({name:"",email:"", password:"",cpassword:"" });
    const onChange = (e)=>{
        setCred({...cred, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const {name, email, password} = cred
        const response = await fetch(`http://127.0.0.1:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({name, email, password})
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

    return (
        <div className='container'>
            <h2 className='mt-3'>Try iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp"onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp"onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password'onChange={onChange} minLength={5} autoComplete="on" required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword'onChange={onChange} minLength={5} autoComplete="on" required/>
                </div>
                <button type="submit" className="btn btn-primary">Sign up</button>
            </form>
        </div>
    )
}

export default Signup
