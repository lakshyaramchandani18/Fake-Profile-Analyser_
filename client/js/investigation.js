/**
 * FPDS - Fake Profile Detection System
 * New Profile Investigation Controller
 * Form validation, non-negative bounds checking, localStorage persistence, and navigation
 */

(function () {
  'use strict';

  function initInvestigationForm() {
    const form = document.getElementById('investigationForm');
    const saveBtn = document.getElementById('saveProfileBtn');
    const saveAndAnalyzeBtn = document.getElementById('saveAndAnalyzeBtn');
    const resetBtn = document.getElementById('resetFormBtn');

    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => handleFormSubmit(e, false));
    }
    if (saveAndAnalyzeBtn) {
      saveAndAnalyzeBtn.addEventListener('click', (e) => handleFormSubmit(e, true));
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', handleFormReset);
    }
  }

  /**
   * Comprehensive Form Validation and Submission
   */
  async function handleFormSubmit(e, navigateToAnalysis = false) {
    e.preventDefault();
    clearValidationErrors();

    const usernameInput = document.getElementById('inputUsername');
    const platformSelect = document.getElementById('selectPlatform');
    const accountAgeInput = document.getElementById('inputAccountAge');
    const postsInput = document.getElementById('inputPosts');
    const followersInput = document.getElementById('inputFollowers');
    const followingInput = document.getElementById('inputFollowing');
    const profilePicSelect = document.getElementById('selectProfilePic');
    const userFlaggedSelect = document.getElementById('selectUserFlagged');
    const unusualActivitySelect = document.getElementById('selectUnusualActivity');
    const notesInput = document.getElementById('inputNotes');

    let isValid = true;

    // 1. Username
    const username = usernameInput ? usernameInput.value.trim().replace(/^@/, '') : '';
    if (!username) {
      showFieldError('inputUsername', 'Username is required.');
      isValid = false;
    } else if (username.length < 2) {
      showFieldError('inputUsername', 'Username must be at least 2 characters.');
      isValid = false;
    }

    // 2. Platform
    const platform = platformSelect ? platformSelect.value : '';
    if (!platform) {
      showFieldError('selectPlatform', 'Please select a social media platform.');
      isValid = false;
    }

    // 3. Account Age (days)
    const accountAgeVal = accountAgeInput ? accountAgeInput.value.trim() : '';
    const accountAge = Number(accountAgeVal);
    if (accountAgeVal === '' || isNaN(accountAge)) {
      showFieldError('inputAccountAge', 'Account age (in days) is required.');
      isValid = false;
    } else if (accountAge < 0) {
      showFieldError('inputAccountAge', 'Account age cannot be negative.');
      isValid = false;
    }

    // 4. Posts Count
    const postsVal = postsInput ? postsInput.value.trim() : '';
    const posts = Number(postsVal);
    if (postsVal === '' || isNaN(posts)) {
      showFieldError('inputPosts', 'Number of posts is required.');
      isValid = false;
    } else if (posts < 0) {
      showFieldError('inputPosts', 'Post count cannot be negative.');
      isValid = false;
    }

    // 5. Followers Count
    const followersVal = followersInput ? followersInput.value.trim() : '';
    const followers = Number(followersVal);
    if (followersVal === '' || isNaN(followers)) {
      showFieldError('inputFollowers', 'Number of followers is required.');
      isValid = false;
    } else if (followers < 0) {
      showFieldError('inputFollowers', 'Followers count cannot be negative.');
      isValid = false;
    }

    // 6. Following Count
    const followingVal = followingInput ? followingInput.value.trim() : '';
    const following = Number(followingVal);
    if (followingVal === '' || isNaN(following)) {
      showFieldError('inputFollowing', 'Number of following is required.');
      isValid = false;
    } else if (following < 0) {
      showFieldError('inputFollowing', 'Following count cannot be negative.');
      isValid = false;
    }

    // 7. Profile Picture Available
    const hasProfilePic = profilePicSelect ? profilePicSelect.value === 'yes' : true;

    // 8. Username Flagged
    const isUsernameFlagged = userFlaggedSelect ? userFlaggedSelect.value === 'yes' : false;

    // 9. Unusual Activity
    const hasUnusualActivity = unusualActivitySelect ? unusualActivitySelect.value === 'yes' : false;

    // 10. Notes
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!isValid) {
      window.FPDS_APP.showToast('Validation Error', 'Please correct the highlighted fields before proceeding.', 'error');
      return;
    }

    const payload = {
      username,
      platform,
      accountAgeDays: accountAge,
      postsCount: posts,
      followersCount: followers,
      followingCount: following,
      hasProfilePic,
      isUsernameFlagged,
      hasUnusualActivity,
      investigatorNotes: notes
    };

    try {
      const savedProfile = await window.FPDS_API.createProfile(payload);

      if (navigateToAnalysis) {
        window.FPDS_APP.showToast('Profile Registered', `Target @${username} queued. Redirecting to forensic analysis...`, 'success');
        setTimeout(() => {
          window.location.href = `analysis.html?id=${savedProfile.id}`;
        }, 800);
      } else {
        window.FPDS_APP.showToast('Profile Saved', `Case #${savedProfile.id} for @${username} saved successfully.`, 'success');
        handleFormReset();
      }
    } catch (err) {
      window.FPDS_APP.showToast('Storage Error', 'Failed to save profile record.', 'error');
    }
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('input-error');
    const parent = field.closest('.form-group');
    if (parent) {
      let errEl = parent.querySelector('.field-error-msg');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'field-error-msg';
        parent.appendChild(errEl);
      }
      errEl.textContent = message;
    }
  }

  function clearValidationErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
  }

  function handleFormReset() {
    clearValidationErrors();
    const form = document.getElementById('investigationForm');
    if (form) form.reset();
    window.FPDS_APP.showToast('Form Reset', 'All input fields have been cleared.', 'info');
  }

  document.addEventListener('DOMContentLoaded', initInvestigationForm);
})();
