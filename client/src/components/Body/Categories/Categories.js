import React, { useEffect } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {fetchAllCategory, dispatchGetAllCategory} from '../../../redux/actions/categoryAction'
import { Link } from 'react-router-dom'

const formatDashboard = {
    color: '#fff',
    margin: '20px 0',
    display: 'block', 
    fontSize: '20px',
    padding: '12px'
}

export default function Categories() {
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const category = useSelector(state => state.category)
    const dispatch = useDispatch()
    const {isManager} = auth
    useEffect(()=>{
        if(token){
             fetchAllCategory(token).then(res=>(dispatch(dispatchGetAllCategory(res))))
        }
    }, [token, dispatch])
    return (
        <>
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
                        <li data-target="#carouselExampleIndicators" data-slide-to={1} />
                        <li data-target="#carouselExampleIndicators" data-slide-to={2} />
                        <li data-target="#carouselExampleIndicators" data-slide-to={3} />
                        <li data-target="#carouselExampleIndicators" data-slide-to={4} />
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img style={{ height: '300px', objectFit: 'cover' }} src='../img/anime.jpg' className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img style={{ height: '300px', objectFit: 'cover' }} src="../img/learning.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img style={{ height: '300px', objectFit: 'cover' }} src="../img/bachground.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img style={{ height: '300px', objectFit: 'cover' }} src="../img/logo.jpg" className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img style={{ height: '300px', objectFit: 'cover' }} src="../img/studentjpg.jpg" className="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-target="#carouselExampleIndicators" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="sr-only">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-target="#carouselExampleIndicators" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="sr-only">Next</span>
                    </button>
                </div>
            <div className="categories__menu">
        {
            isManager &&  <Link to="/dashboard" style={formatDashboard} id="dashboard" className="categories__heading">Dashboard</Link>
        }
                <h2 className="categories__heading">Category</h2>
                <ul className="categories__list">
                {
                    category?.map((cate, index)=>{
                     return  <li key={index} className="categories__item categories__link">
                            <Link to="/" style={{cursor: 'default'}}>{cate.name}</Link>
                        </li>
                    })
                }
                </ul>
        </div>
        </>
    )
}
