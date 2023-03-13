import { FormEvent, useState, useContext } from 'react';
import styles from '../styles/Register.module.css';
import { AuthContext } from '../components/AuthProvider';

function RegisterForm(){
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {register, loading, error} = useContext(AuthContext);

    const registerUser = async (e : FormEvent) =>{
        e.preventDefault();
        
        if(name && email && password){
            register({name, email, password});
        }   
    }

    return(<div className={styles.register}>
        <h2>Register</h2>
        {loading && <h3>Loading... </h3>}
        <form onSubmit={registerUser}>
            {error && <div>{error}</div>}
            <div className={styles.form_group}>
                <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.form_group}>
                <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.form_group}>
                <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className={styles.form_group}>
                <button type="submit">Register</button>
            </div>
        </form>
    </div>)
}

export default RegisterForm;