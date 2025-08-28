const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();   


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));


const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobile: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  street: String,
  city: String,
  state: String,
  country: String,
  loginId: String,
  password: String,
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

app.post("/save", async (req, res) => {
  try {
    // Trim all fields
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const mobile = req.body.mobile?.trim();
    const email = req.body.email?.trim();
    const street = req.body.street?.trim();
    const city = req.body.city?.trim();
    const state = req.body.state?.trim();
    const country = req.body.country?.trim();
    const loginId = req.body.loginId?.trim();
    const password = req.body.password?.trim();

    // Regex
    const nameRegex = /^[A-Za-z]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const loginRegex = /^[A-Za-z0-9]{8}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    const streetRegex = /^[A-Za-z0-9\s]+$/;
    const cityStateCountryRegex = /^[A-Za-z\s]+$/;

    // Empty field check after trim
    if (!firstName) return res.status(400).json({ success: false, message: "First Name is required" });
    if (!lastName) return res.status(400).json({ success: false, message: "Last Name is required" });
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!street) return res.status(400).json({ success: false, message: "Street is required" });
    if (!city) return res.status(400).json({ success: false, message: "City is required" });
    if (!state) return res.status(400).json({ success: false, message: "State is required" });
    if (!country) return res.status(400).json({ success: false, message: "Country is required" });
    if (!loginId) return res.status(400).json({ success: false, message: "Login ID is required" });
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });

    // Validation
    if (!nameRegex.test(firstName)) return res.status(400).json({ success: false, message: "First Name should contain only alphabets" });
    if (!nameRegex.test(lastName)) return res.status(400).json({ success: false, message: "Last Name should contain only alphabets" });
    if (!mobileRegex.test(mobile)) return res.status(400).json({ success: false, message: "Mobile must be exactly 10 digits" });
    if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: "Invalid Email format" });
    if (!streetRegex.test(street)) return res.status(400).json({ success: false, message: "Street can only contain alphabets, numbers and spaces" });
    if (!cityStateCountryRegex.test(city)) return res.status(400).json({ success: false, message: "City should contain only alphabets" });
    if (!cityStateCountryRegex.test(state)) return res.status(400).json({ success: false, message: "State should contain only alphabets" });
    if (!cityStateCountryRegex.test(country)) return res.status(400).json({ success: false, message: "Country should contain only alphabets" });
    if (!loginRegex.test(loginId)) return res.status(400).json({ success: false, message: "Login ID must be 8 alphanumeric characters" });
    if (!passwordRegex.test(password)) return res.status(400).json({ success: false, message: "Password must be 6+ chars with 1 uppercase, 1 lowercase & 1 special char" });

    // Uniqueness
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ success: false, message: "Email already exists!" });

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) return res.status(400).json({ success: false, message: "Mobile already exists!" });

    // Save
    await User.create({ firstName, lastName, mobile, email, street, city, state, country, loginId, password });
    res.json({ success: true, message: "Data Saved Successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



app.get("/get", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
const PORT=process.env.PORT||3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));