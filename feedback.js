document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbacksDiv = document.getElementById('feedbacks');
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const feedbackText = document.getElementById('feedback').value;
        const feedback = {
            id: Date.now(), // Using timestamp as a unique ID
            name: name,
            text: feedbackText,
            likes: 0,
            likedBy: [],
            canDelete: true, // Flag to indicate if the feedback can be deleted
            replies: [] // Array to store replies
        };
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        displayFeedbacks();
        feedbackForm.reset();
    });

    function displayFeedbacks() {
        feedbacksDiv.innerHTML = '';
        feedbacks.forEach(feedback => {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.innerHTML = `
                <p>${feedback.name}: ${feedback.text}</p>
                <span class="like-emoji" data-id="${feedback.id}">👍 ${feedback.likes}</span>
                ${feedback.canDelete ? '<span class="delete-emoji" data-id="' + feedback.id + '">🗑️</span>' : ''}
                <span class="reply-emoji" data-id="${feedback.id}">💬</span>
            `;
            feedbacksDiv.appendChild(feedbackDiv);
    
            // Display replies for this feedback
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'replies';
            feedback.replies.forEach(reply => {
                const replyDiv = document.createElement('div');
                replyDiv.textContent = reply.text;
                repliesDiv.appendChild(replyDiv);
            });
            feedbacksDiv.appendChild(repliesDiv);
        });
    
        // Show "View More" button if there are more than 5 feedbacks
        if (feedbacks.length > 3) {
            viewMoreBtn.style.display = 'block';
        } else {
            viewMoreBtn.style.display = 'none';
        }
    }
    
    

    // Event delegation for like, delete (using dustbin emoji), and reply emojis
feedbacksDiv.addEventListener('click', function(event) {
    if (event.target.classList.contains('like-emoji')) {
        const id = event.target.getAttribute('data-id');
        likeFeedback(id);
    } else if (event.target.classList.contains('delete-emoji')) {
        const id = event.target.getAttribute('data-id');
        deleteFeedback(id);
    } else if (event.target.classList.contains('reply-emoji')) {
        const id = event.target.getAttribute('data-id');
        replyToFeedback(id);
    }
});


    function likeFeedback(id) {
        const feedback = feedbacks.find(f => f.id === parseInt(id));
        if (feedback && !feedback.likedBy.includes(localStorage.getItem('currentUser'))) {
            feedback.likes++;
            feedback.likedBy.push(localStorage.getItem('currentUser'));
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            displayFeedbacks();
        }
    }

    function deleteFeedback(id) {
        const feedback = feedbacks.find(f => f.id === parseInt(id));
        if (feedback && feedback.canDelete) {
            feedbacks = feedbacks.filter(f => f.id !== parseInt(id));
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            displayFeedbacks();
        } else {
            alert('You can only delete feedbacks you created.');
        }
    }

    function replyToFeedback(id) {
        const feedback = feedbacks.find(f => f.id === parseInt(id));
        if (feedback) {
            const replyText = prompt('Enter your reply:');
            if (replyText) {
                const reply = {
                    id: Date.now(), // Using timestamp as a unique ID for the reply
                    text: replyText
                };
                feedback.replies.push(reply);
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
                displayFeedbacks(); // Refresh the display to show the new reply
            }
        }
    }

    // "View More" button functionality
    viewMoreBtn.addEventListener('click', function() {
        feedbacksDiv.style.maxHeight = 'none'; // Remove the max-height to allow scrolling
        viewMoreBtn.style.display = 'none'; // Hide the "View More" button
    });

    // Display feedbacks on page load
    displayFeedbacks();
});
