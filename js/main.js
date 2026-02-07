(function ($) {
  var Preloader = function () {
    $("html").addClass("preload");
    $(window).on("load", function () {
      $("#loader").fadeOut("slow", function () {
        $("#preloader").delay(300).fadeOut("slow");
      });
      $("html").removeClass("preload");
    });
  };
  var Animation = function () {
    var SEPARATION = 50,
      AMOUNTX = 60,
      AMOUNTY = 60;
    var camera, scene, renderer;
    var particles,
      particle,
      count = 0;
    var windowHalfX = window.innerWidth / 4;
    var windowHalfY = window.innerHeight / 4;
    var mouseX = -windowHalfX,
      mouseY = -windowHalfY;

    function init() {
      camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        1,
        1e5
      );
      camera.position.z = 1000;

      scene = new THREE.Scene();

      particles = new Array();
      var PI2 = Math.PI * 2;
      var material = new THREE.SpriteCanvasMaterial({
        color: 0xa020f0, // Purple color
        program: function (context) {
          context.beginPath();
          context.arc(0, 0, 0.15, 0, PI2, true);
          context.fill();
        },
      });
      var i = 0;
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++] = new THREE.Sprite(material);
          particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
          scene.add(particle);
        }
      }
      renderer = new THREE.CanvasRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      $("#wave").prepend(renderer.domElement);
      $(document)
        .on("mousemove", function (event) {
          mouseX = event.clientX * 1.5 - windowHalfX;
        })
        .trigger("mousemouve");
      $(window).on("resize", function () {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      render();
    }

    function render() {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.03;
      camera.position.z = 750;
      camera.lookAt(scene.position);

      var i = 0;
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          particle = particles[i++];
          particle.position.y =
            Math.sin((ix + count) * 0.25) * 100 + // Increased amplitude
            Math.sin((iy + count) * 0.5) * 100; // Increased amplitude
          particle.scale.x = particle.scale.y =
            (Math.sin((ix + count) * 0.25) + 1) * 4 +
            (Math.sin((iy + count) * 0.5) + 1) * 4;
        }
      }
      renderer.render(scene, camera);
      count += 0.05;
      requestAnimationFrame(render);
    }
    return init();
  };
  var SmoothScroll = function () {
    $(".smoothscroll").on("click", function (e) {
      var $target = $(this.hash);
      e.preventDefault();
      e.stopPropagation();
      $("html, body").stop().animate(
        {
          scrollTop: $target.offset().top,
        },
        800,
        "swing"
      );
    });
  };
  var AOSStart = function () {
    AOS.init({
      offset: 100,
      duration: 500,
      easing: "ease-in-sine",
      delay: 250,
      once: true,
      disable: "mobile",
    });
  };

  (function () {
    Preloader();
    Animation();
    SmoothScroll();
    AOSStart();
  })();
})(jQuery);
/* Music Player Logic */
const musicContainer = document.querySelector('.music-player');
const playBtn = document.querySelector('#play-btn');
const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');
const audio = document.querySelector('#audio-player');
const progress = document.querySelector('#progress');
const progressContainer = document.querySelector('#progress-container');
const title = document.querySelector('#track-title');
const artist = document.querySelector('#track-artist');
const volumeSlider = document.querySelector('#volume-slider');
const volumeIcon = document.querySelector('#volume-icon');

// Song titles
const songs = [
  {
    title: 'Vazhikatti',
    artist: 'Fejo',
    src: 'Fejo-Vazhikatti-Kizhakku-Suryan.m4a'
  }
];

// Keep track of song
let songIndex = 0;

// Update song details
function loadSong(song) {
  title.innerText = song.title;
  artist.innerText = song.artist;
  audio.src = song.src;
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume() {
  audio.volume = volumeSlider.value / 100;
  if (audio.volume === 0) {
    volumeIcon.classList.remove('fa-volume-up');
    volumeIcon.classList.add('fa-volume-mute');
  } else {
    volumeIcon.classList.add('fa-volume-up');
    volumeIcon.classList.remove('fa-volume-mute');
  }
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);
volumeSlider.addEventListener('input', setVolume);

// Initial Load
loadSong(songs[songIndex]);
// Initial Load
loadSong(songs[songIndex]);
audio.currentTime = 22; // Start at 22 seconds
audio.volume = 0.5; // Default volume

// Attempt Autoplay with fallback for browser policies
function attemptAutoplay() {
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      // Autoplay started!
      musicContainer.classList.add('play');
      playBtn.querySelector('i.fas').classList.remove('fa-play');
      playBtn.querySelector('i.fas').classList.add('fa-pause');
    }).catch(error => {
      // Autoplay was prevented.
      console.log("Autoplay prevented. Waiting for user interaction.");
      // Add a one-time event listener to start music on first click
      document.addEventListener('click', function enableAudio() {
        playSong();
        document.removeEventListener('click', enableAudio);
      }, { once: true });
    });
  }
}

attemptAutoplay();