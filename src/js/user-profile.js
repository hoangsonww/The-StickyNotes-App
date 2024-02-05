document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  setupEventListeners();
});

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profileInfoStickyNotes')) || {};
  const profileImage = localStorage.getItem('profileImageStickyNotes') || '../../utils/user-default.png';
  document.getElementById('profileImage').src = profileImage;
  document.getElementById('removeProfileImage').style.display = profileImage !== '../../utils/user-default.png' ? 'inline' : 'none';
  document.getElementById('profileImage').src = profileImage;
  document.getElementById('usernameDisplay').innerHTML = `<strong>Username:</strong> ${profile.username || 'N/A'}`;
  document.getElementById('dobDisplay').innerHTML = `<strong>Date of Birth:</strong> ${profile.dob || 'N/A'}`;
  document.getElementById('bioDisplay').innerHTML = `<strong>Bio:</strong> ${profile.bio || 'N/A'}`;
  document.getElementById('locationDisplay').innerHTML = `<strong>Location:</strong> ${profile.location || 'N/A'}`;
  document.getElementById('hobbiesDisplay').innerHTML = `<strong>Hobbies:</strong> ${profile.hobbies || 'N/A'}`;
  document.getElementById('personalQuoteDisplay').innerHTML = `<strong>Personal Quote:</strong> ${profile.personalQuote || 'N/A'}`;
}

function removeProfileImage() {
  localStorage.removeItem('profileImageStickyNotes');
  document.getElementById('profileImage').src = '../../utils/user-default.png';
  document.getElementById('removeProfileImage').style.display = 'none';
}

function setupEventListeners() {
  document.getElementById('saveChanges').addEventListener('click', saveProfileChanges);
  document.getElementById('cancelEdit').addEventListener('click', closeModal);
  document.getElementById('editProfileBtn').addEventListener('click', openEditModal);
  document.getElementById('imageUpload').addEventListener('change', uploadImage);
}

function openEditModal() {
  const profile = JSON.parse(localStorage.getItem('profileInfoStickyNotes')) || {};
  document.getElementById('editUsername').value = profile.username || '';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('editDob').setAttribute('max', today);
  document.getElementById('editBio').value = profile.bio || '';
  document.getElementById('editProfileModal').style.display = 'block';
  document.getElementById('editLocation').value = profile.location || '';
  document.getElementById('editHobbies').value = profile.hobbies || '';
  document.getElementById('editPersonalQuote').value = profile.personalQuote || '';
}

function saveProfileChanges() {
  const profile = {
    username: document.getElementById('editUsername').value,
    dob: document.getElementById('editDob').value,
    bio: document.getElementById('editBio').value,
    location: document.getElementById('editLocation').value,
    hobbies: document.getElementById('editHobbies').value,
    personalQuote: document.getElementById('editPersonalQuote').value
  };

  localStorage.setItem('profileInfoStickyNotes', JSON.stringify(profile));
  closeModal();
  loadProfile();
  window.location.reload();
}

function closeModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}

function uploadImage() {
  const file = document.getElementById('imageUpload').files[0];
  if (file && file.size <= 750 * 1024 * 1024) { // 750MB
    const reader = new FileReader();
    reader.onloadend = function() {
      localStorage.setItem('profileImageStickyNotes', reader.result);
      document.getElementById('profileImage').src = reader.result;
      document.getElementById('removeProfileImage').style.display = 'inline';
    };
    reader.readAsDataURL(file);
  } else {
    alert('File is too large or not an image. Please choose another file.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  handleProfileDisplay();
  setupEventListeners();
});

function handleProfileDisplay() {
  const isSignedInStickyNotes = JSON.parse(localStorage.getItem('isSignedInStickyNotes')) || false;
  const profile = JSON.parse(localStorage.getItem('profileInfoStickyNotes')) || {};
  const welcomeMessage = document.getElementById('welcomeMessage');
  const profileContainer = document.getElementById('profileContainer');
  const signInPrompt = document.getElementById('signInPrompt');

  if (isSignedInStickyNotes) {
    welcomeMessage.textContent = `Welcome, ${profile.username || 'User'}!`;
    profileContainer.style.display = 'block';
    signInPrompt.style.display = 'none';
    loadProfile();
  }
  else {
    welcomeMessage.textContent = '';
    profileContainer.style.display = 'none';
    signInPrompt.textContent = 'Please sign in to view your profile';
    signInPrompt.style.marginBottom = '30px';
    signInPrompt.style.fontWeight = '800';
  }
}

const themeToggleButton = document.createElement("button");
themeToggleButton.innerText = "Toggle Dark Mode";
themeToggleButton.id = "themeToggle";
themeToggleButton.className = "button";
themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark-mode");
  }
  else {
    localStorage.removeItem("theme");
  }
});

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  if (isDarkMode) {
    localStorage.setItem('theme', 'dark-mode');
  }
  else {
    localStorage.removeItem('theme');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  function updateTime() {
    const now = new Date();
    const timeParts = now.toLocaleTimeString().split(" ");
    const timeString = timeParts[0];
    const amPm = timeParts[1];
    document.getElementById("timeContainer").innerHTML = timeString + "<br>" + amPm;
  }
  updateTime();
  setInterval(updateTime, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark-mode") {
    document.body.classList.add("dark-mode");
  }
  else {
    document.body.classList.remove("dark-mode");
  }
});