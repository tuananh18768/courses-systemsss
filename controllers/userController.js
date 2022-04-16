require("dotenv").config();
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail");
const Categories = require("../models/catergories");
const DocumentIdea = require("../models/fileIdea");
const Department = require("../models/department");

const { CLIENT_URL } = process.env;
const userController = {
    register: async(req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Please fill in all fields." });
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ msg: "Invalid email." });
            }
            const user = await Users.findOne({ email });
            if (user)
                return res.status(400).json({ msg: "This email already exists." });
            if (password.length < 6) {
                return res
                    .status(400)
                    .json({ msg: "Password must be at least 6 characters." });
            }
            const passwordHash = await bcrypt.hash(password, 12);

            const newUser = {
                name,
                email,
                password: passwordHash,
            };
            const activation_token = createAtivationToken(newUser);
            const url = `${CLIENT_URL}user/activate/${activation_token}`;
            sendMail(email, url, "Verify your email address");
            res.json({
                msg: "Register Success! Please activate your email to start.",
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    activateEmail: async(req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(
                activation_token,
                process.env.ACTIVATION_TOKEN_SECRET
            );
            const { name, email, password } = user;
            const check = await Users.findOne({ email });
            if (check)
                return res.status(400).json({ msg: "This email is alread exits." });

            const newUser = new Users({
                name,
                email,
                password,
            });
            await newUser.save();
            res.json({ msg: "Account has been activated!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async(req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "This email does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Password is incorrect." });

            const refresh_token = createRefreshToken({ id: user._id });
            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/user/refresh_token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ msg: "Login success!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login now!" });

                const access_token = createAccessToken({ id: user.id });
                res.json({ access_token });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    forgotPassword: async(req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "This email dose not exits." });

            const access_token = createAccessToken({ id: user.id });
            const url = `${CLIENT_URL}user/reset/${access_token}`;

            sendMail(email, url, "Reset your password");
            res.json({ msg: "Re-send the password, please check your email." });
        } catch {
            return res.status(500).json({ msg: err.message });
        }
    },
    resetPassword: async(req, res) => {
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash,
            });
            res.json({ msg: "Password successfully changed!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getUserInfor: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("-password");
            res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getUserAllInfor: async(req, res) => {
        try {
            const users = await Users.find().select("-password");
            res.json(users);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async(req, res) => {
        try {
            res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
            return res.json({ msg: "Logout!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateInfor: async(req, res) => {
        try {
            const { name } = req.body;
            await Users.findByIdAndUpdate({ _id: req.user.id }, {
                name,
            });
            res.json({ msg: "Update successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateUserRole: async(req, res) => {
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);
            await Users.findByIdAndUpdate({ _id: req.params.id }, {
                password: passwordHash,
            });
            res.status(200).json({ msg: "Update successfully" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteUser: async(req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id);
            const doc = await DocumentIdea.find();
            for (let item of doc) {
                if (item.staff_id.toString() === req.params.id) {
                    await DocumentIdea.findByIdAndDelete(item._id);
                }
            }
            res.json({ msg: "Delete successfully" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addCategory: async(req, res) => {
        try {
            // const { name, departments } = req.body
            const category = await Categories.findOne({ name: req.body.name });
            if (category)
                return res.status(400).json({ msg: "This category dose already." });
            const newCate = new Categories({
                name: req.body.name,
                manger_cate: req.user.id,
                departments: req.body.departments,
            });
            console.log(req.body.name);
            await newCate.save();
            res.json({ msg: "Categories add successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    addDepartment: async(req, res) => {
        try {
            const { name, set_deadline, set_deadlineSecond } = req.body;
            const departmentName = await Department.findOne({ name: name });
            if (departmentName)
                return res.status(400).json({ msg: "This department dose already." });
            let message2 = "Set deadline second not valid!!!";
            let message = "Set deadline first not valid!!!";
            let setDeadlineSecond =
                new Date(set_deadlineSecond).getTime() >
                new Date(set_deadline).getTime();
            let setDeadlineFirst =
                new Date(set_deadline).getTime() > new Date().getTime();

            if (!setDeadlineFirst) {
                return res.status(404).json({ msg: message });
            }
            if (!setDeadlineSecond) {
                return res.status(404).json({ msg: message2 });
            }
            const newDepartment = new Department({
                name,
                set_deadline: set_deadline || new Date(),
                set_deadlineSecond: set_deadlineSecond || new Date(),
            });
            await newDepartment.save();
            res.json({ msg: "Department add successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateDepartment: async(req, res) => {
        try {
            const { name, set_deadline, set_deadlineSecond } = req.body;
            let message2 = "Set deadline second not valid!!!";
            let message = "Set deadline first not valid!!!";
            let setDeadlineSecond =
                new Date(set_deadlineSecond).getTime() >
                new Date(set_deadline).getTime();
            let setDeadlineFirst =
                new Date(set_deadline).getTime() > new Date().getTime();

            if (!setDeadlineFirst) {
                return res.status(404).json({ msg: message });
            }
            if (!setDeadlineSecond) {
                return res.status(404).json({ msg: message2 });
            }
            await Department.findByIdAndUpdate({ _id: req.params.id }, {
                name,
                set_deadline,
                set_deadlineSecond,
            });
            res.json({ msg: "Set date successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteCategory: async(req, res) => {
        try {
            await Categories.findByIdAndRemove(req.params.id);
            const doc = await DocumentIdea.find();
            for (let item of doc) {
                if (item.category.toString() === req.params.id) {
                    await DocumentIdea.findByIdAndDelete(item._id);
                }
            }
            res.status(500).json({ msg: "Delete successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateCategory: async(req, res) => {
        try {
            const { name } = req.body;
            console.log(req.body);
            const nameOld = await Categories.findOne({ name: name });
            if (nameOld) {
                return res.status(404).json({ msg: "This category has already!!!" });
            }
            await Categories.findByIdAndUpdate({ _id: req.params.id }, {
                name,
            });
            res.status(200).json({ msg: "Update category successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    // setTimeCategory: async(req, res) => {
    //     try {
    //         const params = req.params.id
    //         const checkCategory = await Categories.findById(params)
    //         if (!checkCategory) return res.status(500).json({ msg: 'Not valid!!' })

    //         const newSetTime = new Categories({
    //             set_deadline: req.body
    //         })
    //         newSetTime.save()
    //         res.status(200).json({ msg: 'set time successfully' })
    //     } catch (error) {
    //         return res.status(500).json({ msg: error.message })
    //     }
    // },
    dashboard: async(req, res) => {
        try {
            const user = await Users.find();
            const postIdea = await DocumentIdea.find();
            const cateAll = await Categories.find();

            let ideaOfuser = [];
            let arrayCate = [];
            let catePost = [];
            ideaOfuser = await Promise.all(
                postIdea.map(async(current) => {
                    const cate = await Categories.findById(current.category);
                    const timeFirst = await Department.findById(cate.departments);
                    const userStaff = await Users.findById(current.staff_id);
                    const statusDeadline =
                        new Date(timeFirst.set_deadline).getTime() > new Date().getTime();
                    return {
                        ...current._doc,
                        category: cate.name,
                        statusDeadline,
                        staff_id: userStaff.name,
                    };
                })
            );
            arrayCate = await Promise.all(
                cateAll.map(async(e) => {
                    catePost = await DocumentIdea.find({ category: e._id });
                    return {...e._doc, catePost };
                })
            );
            const allStaff = [];
            for (let item of user) {
                if (item.role === 0) {
                    allStaff.push(item);
                }
            }
            const dashboard = {
                allStaff: allStaff,
                postIdea: ideaOfuser,
                arrayCate: arrayCate,
            };
            res.send(dashboard);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllCategory: async(req, res) => {
        try {
            const allCate = await Categories.find();
            res.send(allCate);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllDepartment: async(req, res) => {
        try {
            const allDepartment = await Department.find();
            res.status(200).json(allDepartment);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getOneDepartment: async(req, res) => {
        try {
            const userModel = await Users.find();
            const cate = await Categories.find();
            const postIdea = await DocumentIdea.find();
            const departmentMain = await Department.find({ _id: req.params.id });
            const departmentCate = [];
            for (let item of cate) {
                if (item.departments.toString() === req.params.id) {
                    departmentCate.push(item); //c1
                    // departmentCate.push(item._id.toString()) //c2
                }
            }
            const postsAll = postIdea.filter((e) => {
                // return departmentCate.includes(e.category.toString()) //c2
                return (
                    departmentCate.filter(
                        (p) => p._id.toString() === e.category.toString()
                    ).length > 0
                ); //c1
            });
            const dataIdea = postsAll.map((element) => {
                const userPost = userModel.find(
                    (item) => item._id.toString() === element.staff_id.toString()
                );
                return {
                    ...element._doc,
                    name_user: userPost.name,
                    user_avatar: userPost.avatar,
                    departmentDeadlineOne: departmentMain,
                    // departmentDeadlineSecond: departmentMain.set_deadlineSecond,
                };
            });
            res.json(dataIdea);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteDepartment: async(req, res) => {
        try {
            await Department.findByIdAndDelete(req.params.id);
            const cate = await Categories.find();
            for (let item of cate) {
                if (item.departments.toString() === req.params.id) {
                    await Categories.findByIdAndDelete(item._id);
                }
            }
            res.status(200).json({ msg: "Delete department successfully" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const createAtivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "5m",
    });
};
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

module.exports = userController;