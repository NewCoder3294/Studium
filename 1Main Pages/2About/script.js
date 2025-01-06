document.getElementById('interactive-button').addEventListener('click', function () {
  const reasons = [
    "Studium offers scientifically-backed study techniques.",
    "Our tools are designed to make learning efficient and enjoyable.",
    "From Active Recall to Mind Mapping, we cover it all!",
    "Join thousands of learners who have transformed their study habits with Studium."
  ];

  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  document.getElementById('dynamic-text').textContent = randomReason;
});