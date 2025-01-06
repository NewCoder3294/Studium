document.getElementById('email-form').addEventListener('submit', function (event) {
  event.preventDefault(); 
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  if (!name || !email || !subject || !message) {
    alert('Please fill out all fields.');
    return;
  }

  console.log('Sending email...');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Subject:', subject);
  console.log('Message:', message);

  alert('Your message has been sent! We will get back to you soon.');

  document.getElementById('email-form').reset();
});