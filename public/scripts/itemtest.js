
const sendEmailButton = document.getElementById('sendEmailButton');
const userEmail = sendEmailButton.dataset.userEmail;

sendEmailButton.addEventListener('click', () => {
  console.log(userEmail);
  const subject = "Foundit!"
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const mailUrl = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}`;  
    window.location.href = mailUrl
  }else{
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}&su=${subject}`;
  window.open(gmailUrl, '_blank');
}
})