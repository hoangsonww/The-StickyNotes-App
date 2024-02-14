import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

function translateFBC(value) {
  return atob(value);
}

function getFBConfig1() {
  const fbConfig1 = "QUl6YVN5REw2a1FuU2ZVZDhVdDhIRnJwS3VpdnF6MXhkWG03aw==";
  return translateFBC(fbConfig1);
}

function getFBConfig2() {
  const fbConfig2 = "bW92aWV2ZXJzZS1hcHAuZmlyZWJhc2VhcHAuY29t";
  return translateFBC(fbConfig2);
}

function getFBConfig3() {
  const fbConfig3 = "bW92aWV2ZXJzZS1hcHAuYXBwc3BvdC5jb20=";
  return translateFBC(fbConfig3);
}

function getFBConfig4() {
  const fbConfig4 = "ODAyOTQzNzE4ODcx";
  return translateFBC(fbConfig4);
}

function getFBConfig5() {
  const fbConfig5 = "MTo4MDI5NDM3MTg4NzE6d2ViOjQ4YmM5MTZjYzk5ZTI3MjQyMTI3OTI=";
  return translateFBC(fbConfig5);
}

const firebaseConfig = {
  apiKey: getFBConfig1(),
  authDomain: getFBConfig2(),
  projectId: "movieverse-app",
  storageBucket: getFBConfig3(),
  messagingSenderId: getFBConfig4(),
  appId: getFBConfig5()
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  setupEventListeners();
});

async function loadProfile() {
  const userEmail = localStorage.getItem('currentlySignedInStickyNotesUser');
  if (!userEmail) return;

  const docRef = doc(db, 'profiles', userEmail);
  try {
    const docSnap = await getDoc(docRef);
    let profile = {
      username: 'N/A',
      dob: 'N/A',
      bio: 'N/A',
      location: 'N/A',
      hobbies: 'N/A',
      personalQuote: 'N/A',
      profileImage: '../../utils/user-default.png'
    };

    if (docSnap.exists()) {
      profile = { ...profile, ...docSnap.data() };
    }

    document.getElementById('profileImage').src = profile.profileImage;
    document.getElementById('removeProfileImage').style.display = profile.profileImage !== '../../utils/user-default.png' ? 'inline' : 'none';
    document.getElementById('usernameDisplay').innerHTML = `<strong>Username:</strong> ${profile.username}`;
    document.getElementById('dobDisplay').innerHTML = `<strong>Date of Birth:</strong> ${profile.dob}`;
    document.getElementById('bioDisplay').innerHTML = `<strong>Bio:</strong> ${profile.bio}`;
    document.getElementById('locationDisplay').innerHTML = `<strong>Location:</strong> ${profile.location}`;
    document.getElementById('hobbiesDisplay').innerHTML = `<strong>Hobbies:</strong> ${profile.hobbies}`;
    document.getElementById('personalQuoteDisplay').innerHTML = `<strong>Personal Quote:</strong> ${profile.personalQuote}`;
  }
  catch (error) {
    console.error("Error loading profile: ", error);
  }
}

function removeProfileImage() {
  const userEmail = localStorage.getItem('currentlySignedInStickyNotesUser');
  const profileImageKey = `profileImage-${userEmail}`;

  localStorage.removeItem(profileImageKey);
  document.getElementById('profileImage').src = '../../images/user-default.png';
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

async function saveProfileChanges() {
  const userEmail = localStorage.getItem('currentlySignedInStickyNotesUser');
  if (!userEmail) return;

  const profile = {
    username: document.getElementById('editUsername').value,
    dob: document.getElementById('editDob').value,
    bio: document.getElementById('editBio').value,
    location: document.getElementById('editLocation').value,
    hobbies: document.getElementById('editHobbies').value,
    personalQuote: document.getElementById('editPersonalQuote').value
  };

  try {
    await setDoc(doc(db, 'profiles', userEmail), profile);
    closeModal();
    loadProfile();
  } catch (error) {
    console.error("Error saving profile changes: ", error);
  }
}

function closeModal() {
  document.getElementById('editProfileModal').style.display = 'none';
}


async function uploadImage() {
  const userEmail = localStorage.getItem('currentlySignedInStickyNotesUser');
  if (!userEmail) {
    alert("You're not signed in.");
    return;
  }

  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  if (!file) {
    alert('No file selected. Please choose an image.');
    return;
  }

  try {
    const resizedBlob = await resizeImage(file, 1024, 1024);

    const imageRef = storageRef(storage, `profileImages/${userEmail}`);
    const snapshot = await uploadBytes(imageRef, resizedBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    await setDoc(doc(db, 'profiles', userEmail), { profileImage: downloadURL }, { merge: true });
    document.getElementById('profileImage').src = downloadURL;
    document.getElementById('removeProfileImage').style.display = 'inline';

    console.log('Image uploaded and Firestore updated with URL:', downloadURL);
  }
  catch (error) {
    console.error("Error during image upload or Firestore update:", error);
    alert('Error during image upload: ' + error.message);
  }
}

function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        }
        else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', 0.7);
      };
      img.onerror = (error) => reject(error);
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  handleProfileDisplay();
  setupEventListeners();
});

function handleProfileDisplay() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedInStickyNotes')) || false;
  const userEmail = localStorage.getItem('currentlySignedInStickyNotesUser');
  const profileKey = `profileInfo-${userEmail}`;
  const profile = JSON.parse(localStorage.getItem(profileKey)) || {};
  const welcomeMessage = document.getElementById('welcomeMessage');
  const profileContainer = document.getElementById('profileContainer');
  const signInPrompt = document.getElementById('signInPrompt');

  if (isSignedIn && userEmail) {
    welcomeMessage.textContent = `Welcome, ${profile.username || 'User'}!`;
    profileContainer.style.display = 'block';
    signInPrompt.style.display = 'none';
    loadProfile();
  }
  else {
    welcomeMessage.textContent = '';
    profileContainer.style.display = 'none';
    signInPrompt.textContent = 'Please sign in to view your profile';
    signInPrompt.style.fontWeight = '800';
    signInPrompt.style.marginBottom = '50px';
    signInPrompt.style.color = '#e0690f'
  }
}
