
/*function musica() {  
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.src = "./musica/Spice Girls - Wannabe ( Lyrics ) 🎵.mp3";  
  
      audio.addEventListener('canplaythrough', () => {
        audio.play()
          .then(() => resolve('Audio reproducido correctamente'))
          .catch(error => reject('Error al reproducir el audio: ' + error));
      });
  
      audio.addEventListener('error', () => {
        reject('No se pudo cargar el archivo de audio');
      });
  
      // Añadir el elemento audio al DOM
      document.body.appendChild(audio);
    });
  }
  
  let audioPlayed = false;
  const scrollThreshold = 100; // Umbral de desplazamiento en píxeles
  
  window.addEventListener('scroll', () => {
    if (!audioPlayed && window.scrollY > scrollThreshold) {
      musica()
        .then(message => {
          console.log(message);
          audioPlayed = true; // Evita que el audio se reproduzca más de una vez
        })
        .catch(error => console.error(error));
    }
  });*/
  