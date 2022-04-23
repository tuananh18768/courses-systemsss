import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard, dispatchDashboard } from '../../../redux/actions/dashboardActions'

import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar, Radar, Pie } from 'react-chartjs-2'
ChartJS.register(...registerables);
export default function Dashboard() {
    const token = useSelector(state => state.token)
    const dashboard = useSelector(state => state.dashboard)

    const dispatch = useDispatch()
    useEffect(() => {
        return fetchDashboard(token).then(res => dispatch(dispatchDashboard(res)))
    }, [token, dispatch])


    const like1 = () => {
        const likeDashboard = dashboard.postIdea?.map(element => element.likes.length)
        return likeDashboard
    }
    const dislike = () => {
        const dislikeDashboard = dashboard.postIdea?.map(element => element.dislikes.length)
        return dislikeDashboard
    }
    const comment = () => {
        const dislikeDashboard = dashboard.postIdea?.map(element => element.comments.length)
        return dislikeDashboard
    }
    const view = () => {
        const viewDashboard = dashboard.postIdea?.map(element => element.views.length)
        return viewDashboard
    }
    const namePost = () => {
        const nameDashboard = dashboard.postIdea?.map(element => element.staff_id)
        return nameDashboard
    }
    const nameDeparment = () => {
        const nameAllDeparment = dashboard.arrayDepartment?.map(element => element.name)
        return nameAllDeparment
    }
    const arrayCate = () => {
        const nameCate = dashboard.arrayCate?.map(element => element.name)
        return nameCate
    }
    const elementCate = () => {
        const objCate = dashboard.arrayCate?.map(e => e.catePost.length)
        return objCate
    }
    const elementDepartment = () => {
        const objDepartment = dashboard.arrayDepartment?.map(e => e.deparmentPost.length)
        return objDepartment
    }
    console.log(dashboard)
    return (
        <div className="db" style={{ marginTop: '116px' }}>
            <div className="db__row">
                <div className="db__col-4 mgr10">
                    <div className="dbbox">
                        <div>
                            <h4>Total Department</h4>
                            <p>Last year expenses</p>
                        </div>
                        <div className>
                            <span>{dashboard.arrayDepartment?.length}</span>
                        </div>
                    </div>
                </div>
                <div className="db__col-4 mgr10">
                    <div className="dbbox">
                        <div>
                            <h4>Total Post</h4>
                            <p>Last year expenses</p>
                        </div>
                        <div className>
                            <span>{dashboard.postIdea?.length}</span>
                        </div>
                    </div>
                </div>
                <div className="db__col-4 mgl10 mgr10">
                    <div className="dbbox">
                        <div>
                            <h4>Total Staff</h4>
                            <p>Last year expenses</p>
                        </div>
                        <div>
                            <span>{dashboard.allStaff?.length}</span>
                        </div>
                    </div>
                </div>
                <div className="db__col-4 mgl10">
                    <div className="dbbox">
                        <div>
                            <h4>Total Category</h4>
                            <p>Last year expenses</p>
                        </div>
                        <div>
                            <span>{dashboard.arrayCate?.length}</span>
                        </div>
                    </div>
                </div>

            </div>
            <div className="db__row">
                <div className="col6 mgr10">
                    <div className="dbitem">
                        <h3 className="text-center">Post All</h3>
                        <Bar
                            data={{
                                labels: namePost(),
                                datasets: [
                                    {
                                        label: "Like",
                                        backgroundColor: [
                                            "rgba(255, 0, 132, 0.2)"
                                        ],
                                        data: like1(),
                                        borderColor: "rgba(255, 0, 132, 1)",
                                        fill: "start",
                                        borderWidth: 0.5
                                    },
                                    {
                                        label: "Dislike",
                                        backgroundColor: [
                                            "rgba(0, 168, 255, 0.2)"
                                        ],
                                        data: dislike(),
                                        borderColor: "rgba(0, 168, 255, 1)",
                                        fill: "start",
                                        borderWidth: 0.5
                                    },
                                    {
                                        label: "Comment",
                                        backgroundColor: [
                                            "rgba(93, 13, 54, 0.8)"
                                        ],
                                        data: comment(),
                                        borderColor: "rgba(93, 13, 54, 0.8)",
                                        fill: "start",
                                        borderWidth: 0.5
                                    },
                                    {
                                        label: "View",
                                        backgroundColor: [
                                            "rgba(120, 255, 0, 0.2)"
                                        ],
                                        data: view(),
                                        borderColor: "rgba(120,255,0, 1)",
                                        fill: "start",
                                        borderWidth: 0.5
                                    }
                                ],
                            }}
                            options={{
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "Predicted world population (millions) in 2050"
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="col7">
                    <div className="col7__item">
                        <h3 className="text-center">Deparment All</h3>
                        <Radar
                            data={{
                                labels: nameDeparment(),
                                datasets: [
                                    {
                                        label: "Category",
                                        backgroundColor: [
                                            "rgba(255, 0, 132, 0.1)"
                                        ],
                                        data: elementDepartment(),
                                        borderColor: "rgba(255, 0, 132, 1)",
                                        fill: "start",
                                        borderWidth: 0.5
                                    },

                                ],
                            }}
                            options={{
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "Predicted world population (millions) in 2050"
                                }
                            }}
                        />

                    </div>
                    <div className="col7__item">
                        <h3 className="text-center">Category All</h3>
                        <Pie
                            data={{
                                labels: arrayCate(),
                                datasets: [
                                    {
                                        label: "All post",
                                        backgroundColor: [
                                            'rgba(255, 0, 132, 0.2)',
                                            'rgba(93, 13, 54, 0.8)',
                                            'rgba(120, 255, 0, 0.2)',
                                            'rgba(0, 168, 255, 0.2)',
                                            'rgba(245, 121, 145, 0.8)',
                                            'rgba(50, 50, 69, 0.8)',
                                            'rgba(102, 145, 138, 0.8)',
                                            'rgba(131, 153, 149, 0.8)',
                                            'rgba(65, 114, 25, 0.8)',
                                            'rgba(104, 105, 12, 0.8)',
                                            'rgba(221, 223, 15, 0.8)',
                                        ],
                                        data: elementCate(),

                                        fill: "start",
                                        borderWidth: 0.5
                                    },
                                ],
                            }}
                            options={{
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: "Predicted world population (millions) in 2050"
                                }
                            }}
                        />
                    </div>
                    <div className="col7__item">
                    </div>
                </div>
            </div>
            <div className="db__row">
                <div className="col1">
                    <div className="dbitem">

                    </div>
                </div>
            </div>
        </div>

    )
}
