import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Categories from '../Categories/Categories'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { showErrMsg, showSuccessMsg } from '../../utils/Notification/Notification'
import { fetchAllCategory, dispatchGetAllCategory } from '../../../redux/actions/categoryAction'

const dataUpload = {
    title: '',
    description: '',
    error: '',
    success: '',
}

function UploadIdea() {
    const categories = useSelector(state => state.category)
    const token = useSelector(state => state.token)
    // console.log(categories);
    const [post, setPost] = useState(dataUpload)
    const [file, setFile] = useState([])
    const [category, setCategory] = useState()
    // const [msg, setMsg] = useState()
    // const [msgErr, setMsgErr] = useState()

    const { title, description, error, success } = post
    const handleChange = (e) => {
        const { name, value } = e.target
        setPost({ ...post, [name]: value, error, success })
    }
    const handleChangeFile = (e) => {
        setFile(e.target.files)
    }
    
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("title", title)
        formData.append("description", description)
        formData.append("category", category)
        for(let i = 0; i < file.length; i++) {
            formData.append("file", file[i])
        }
        try {
            const res = await axios.post('/api/upload_idea/', formData, { headers: { Authorization: token, "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } })
            setPost({ ...post, error: error, success: res.data.msg })
        } catch (error) {
            error.response.data.msg && setPost({ ...post, error: error.response.data.msg, success })
        }
    }

    return (
      <>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Đồng ý với các điều khoản</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                    <ul style={{listStyle: 'disc inside'}}>
                                        <li>Đồng ý và làm theo nội quy trong hệ thống để mọi người góp ý</li>
                                        <li>Baì viết của bạn sẽ bị ẩn danh người đăng để bảo mật thông tin cho bạn và mọi người</li>
                                    </ul>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleSubmit}>Accept</button>
                                    </div>
                                </div>
                            </div>
                        </div>
        <div style={{ display: 'flex' }}>
            <div className="main__left">
                <section className="categories">
                    <Categories />
                </section>
            </div>
            <div className="container content_upload" style={{ padding: 0 }}>
                <div className="idea">
                    <div className="time_deadline">
                        <span> Deadline: </span>
                    </div>
                    <div className="div__idea">
                        <div className="icon">
                            <i className="fa-solid fa-file-arrow-up" />
                        </div>
                    </div>
                </div>
                <div className="add__idea">
                    <h1 id="heading">ADD YOUR IDEA</h1>
                    <form encType="multipart/form-data">
                        <div className="row">
                            <label className="col-12" htmlFor="title">Title</label>
                            <input className="col-12" type="text" id="title" name='title' value={title} onChange={handleChange} />
                        </div>
                        <div className="row">
                            <label className="col-12" htmlFor="category">Category</label>
                            <select className="col-12" name="category" id="category" value={category} onChange={(p) => setCategory(p.target.value)}>
                                <option>------Choose category------</option>
                                {categories?.map((element, index) => {
                                    return <option key={index} value={element._id}>{element.name}</option>
                                })
                                }
                            </select>
                        </div>
                        <div className="row">
                            <div className="col-12" style={{ display: 'inline-block', width: '20%', verticalAlign: 100 }}>
                                <label htmlFor="desc">Description</label>
                            </div>
                            <textarea className="col-12" id="textarea" name="description" style={{ height: 200 }} placeholder="Enter text here..." value={description} onChange={handleChange} />
                        </div>
                        <div className="row">
                            <label className="col-12" htmlFor="file-input">File</label>
                            <input className="col-12" type="file" id="file-input" name="file" multiple onChange={handleChangeFile} />
                            {/* <label  htmlFor="file-input"><i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: 10 }} />Choose a file...</label> */}
                        </div>
                        <div className="row">
                            {
                                error && <textarea disabled className="col-12 my-4" id="textarea" name="description" style={{ height: 50, color: "red" }} value={error} />
                            }
                            {success && <textarea disabled className="col-12 my-4" id="textarea" name="description" style={{ height: 50, color: "green" }} value={success} />
                            }
                        </div>
                        <div className="text-center btn_idea">
                            <Link to="/addIdea" id="btn_idea"  data-toggle="modal" data-target="#exampleModal">SUBMIT</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div>
            </div>

        </div>
      </>

    )
}

export default UploadIdea