// app.post('/usersignup', async (req,res)=>{
//   try {
//     let { name, email, password } = req.body;
//         const namePattern = /^[a-zA-Z\s]+$/;
//         if (!namePattern.test(name)) {
//         return res.status(400).send("Name can only contain letters and spaces.");
//         }
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@vitapstudent\.ac\.in$/;
//         if (!emailPattern.test(email)) {
//           return res.status(400).send("Please use a valid VIT-AP student email address.");
//         }
//         const passwordPattern = /^\S{5,}$/;
//         if(!passwordPattern.test(email)) {
//           return res.status(400).send("Password must be at least 5 characters long and cannot contain spaces.")
//         }
//     let user = await userModel.findOne({ email });
//     if (user) {
//       return res.status(409).send("User already registered. Try logging in instead.");
//     }

//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) throw err;
//       bcrypt.hash(password, salt, async (err, hash) => {
//         if (err) throw err;
//         try {
//           let createdUser = await userModel.create({
//             name,
//             email,
//             password: hash,
//           });
//           let token = generateToken(createdUser);
//           res.cookie("token", token);
//           res.redirect("/");
//         } catch (error) {
//           console.error("Error creating user:", error);
//           res.status(500).send("Error creating user.");
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Error during user signup:", error);
//     res.status(500).send("Error during signup.");
//   }
// })
// app.post("/userlogin", async (req,res)=>{
//   try{
//   let user = await userModel.findOne({email: req.body.email})
//   if(!user) return res.send("something went wrong")
//   const match = await bcrypt.compare(req.body.password, user.password)
//   if(match){
//     let token = generateToken(user)
//     res.cookie("token", token)
//     return res.redirect("/")
//   }else{
//     res.send("password/username incorrect")
//   }} catch(error){
//     console.error(error)
//     return res.send("an error occured")
//   } 
//   })
// app.get('/logout',(req,res)=>{
//   res.cookie("token", "")
//   res.redirect("login")
// })