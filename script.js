document.addEventListener('DOMContentLoaded', function() {
    const songs = document.querySelectorAll('.song');
    const playlist = document.getElementById('playlist');
    const playButton = document.getElementById('play-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const currentPlatform = document.getElementById('current-platform');
    const currentSong = document.getElementById('current-song');
    const currentPlatformName = document.getElementById('current-platform-name');

    let currentTrackIndex = -1;
    let isPlaying = false;

    if (songs.length > 0) {
        songs.forEach(song => {
            song.addEventListener('dragstart', dragStart);
            song.addEventListener('dragend', dragEnd);
        });
    }

    if (playlist) {
        playlist.addEventListener('dragover', dragOver);
        playlist.addEventListener('dragenter', dragEnter);
        playlist.addEventListener('dragleave', dragLeave);
        playlist.addEventListener('drop', drop);
    } else {
        console.error('Playlist element not found');
    }

    if (playButton) {
        playButton.addEventListener('click', togglePlay);
    } else {
        console.error('Play button not found');
    }

    if (prevButton) {
        prevButton.addEventListener('click', playPrevious);
    } else {
        console.error('Previous button not found');
    }

    if (nextButton) {
        nextButton.addEventListener('click', playNext);
    } else {
        console.error('Next button not found');
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.outerHTML);
        this.classList.add('dragging');
    }

    function dragEnd() {
        this.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }

    function dragLeave() {
        this.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const songData = e.dataTransfer.getData('text/plain');
        const songElement = document.createElement('div');
        songElement.innerHTML = songData;
        const song = songElement.firstChild;
        this.appendChild(song);
        
        // Remove the song from the original list
        const originalSong = document.querySelector('.dragging');
        if (originalSong) {
            originalSong.remove();
        }
        
        updatePlayer();
    }

    function togglePlay() {
        if (playlist.children.length === 0) return;
        isPlaying = !isPlaying;
        updatePlayerUI();
    }

    function playPrevious() {
        if (playlist.children.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + playlist.children.length) % playlist.children.length;
        updatePlayer();
    }

    function playNext() {
        if (playlist.children.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % playlist.children.length;
        updatePlayer();
    }

    function updatePlayer() {
        if (playlist && playlist.children.length === 0) {
            currentTrackIndex = -1;
            isPlaying = false;
            if (currentPlatform) currentPlatform.className = 'fas fa-music';
            if (currentSong) currentSong.textContent = 'No song playing';
            if (currentPlatformName) currentPlatformName.textContent = 'Drop a song to start';
        } else if (playlist) {
            if (currentTrackIndex === -1) currentTrackIndex = 0;
            const currentTrack = playlist.children[currentTrackIndex];
            const platform = currentTrack.dataset.platform;
            if (currentPlatform) {
                if (platform === 'Apple Music') {
                    currentPlatform.className = 'fab fa-apple';
                } else {
                    currentPlatform.className = `fab fa-${platform.toLowerCase()}`;
                }
            }
            if (currentSong) currentSong.textContent = currentTrack.querySelector('span').textContent;
            if (currentPlatformName) currentPlatformName.textContent = platform;
        }
        updatePlayerUI();
    }

    function updatePlayerUI() {
        if (playButton) {
            playButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
    }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to feature items
const featureItems = document.querySelectorAll('.feature-item');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

featureItems.forEach(item => {
    observer.observe(item);
});

document.addEventListener('DOMContentLoaded', () => {
    const vinylRecord = document.querySelector('.vinyl-record');
    const tonearm = document.querySelector('.tonearm');
    
    if (vinylRecord && tonearm) {
        let isPlaying = false;
        let rotationAngle = 0;
        let animationFrameId;

        function rotateVinyl() {
            rotationAngle += 1;
            vinylRecord.style.transform = `rotate(${rotationAngle}deg)`;
            if (isPlaying) {
                animationFrameId = requestAnimationFrame(rotateVinyl);
            }
        }

        vinylRecord.addEventListener('mouseenter', () => {
            if (!isPlaying) {
                isPlaying = true;
                tonearm.style.transform = 'rotate(-10deg)';
                rotateVinyl();
            }
        });

        vinylRecord.addEventListener('mouseleave', () => {
            isPlaying = false;
            tonearm.style.transform = 'rotate(-30deg)';
            cancelAnimationFrame(animationFrameId);
            // Smoothly return to initial position
            const returnToZero = () => {
                rotationAngle *= 0.95; // Decrease angle by 5% each frame
                vinylRecord.style.transform = `rotate(${rotationAngle}deg)`;
                if (Math.abs(rotationAngle) > 0.1) {
                    requestAnimationFrame(returnToZero);
                } else {
                    vinylRecord.style.transform = 'rotate(0deg)';
                }
            };
            returnToZero();
        });
    } else {
        console.error('Vinyl record or tonearm element not found');
    }
});

