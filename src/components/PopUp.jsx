import './PopUp.css'

const PopUp = ({message, className}) => message ? <div className={className}>{message}</div> : null

export default PopUp
