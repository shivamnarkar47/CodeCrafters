import { useParams } from "react-router-dom"

function StocksBlockID() {
    const {id} = useParams();
    return (
        <>
        <h1>{id}</h1>
        </>
    )
}

export default StocksBlockID