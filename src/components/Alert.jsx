import React, { useEffect, useState } from 'react'

export default function Alert( {success, points, setSuccess} ) {
    const [alertType, setAlertType] = useState('')

    useEffect(() => {
        switch(success) {
            case '':
                setAlertType('');
                break;
            case 'failure': 
                setAlertType('WORD DOES NOT EXIST');
                break;
            case 'success':
                setAlertType(`+${points}`);
                break;
            case 'tooShort': 
                setAlertType('WORD MUST BE 3 OR MORE CHARACTERS');
                break;
            case 'found':
                setAlertType('WORD HAS ALREADY BEEN FOUND')
                break;
            default:
                setAlertType('');
        }
        if(success.length) {
            const toRef = setTimeout(() => {
                setSuccess('');
                clearTimeout(toRef)
            }, 3000)
        }
    }, [success])

    return (
        <div className="alert">
            <p className={success}>{alertType}</p>
        </div>
    )
}