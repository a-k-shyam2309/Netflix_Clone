(() => {
  const scene = document.querySelector('.auth-copy');
  if (!scene || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  scene.addEventListener('pointermove', (event) => {
    if (window.innerWidth <= 850) return;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    scene.style.backgroundPosition = `${58 + x * 3}% ${50 + y * 3}%`;
    scene.style.setProperty('--scene-x', `${x * 15}px`);
    scene.style.setProperty('--scene-y', `${y * 15}px`);
    scene.style.setProperty('--scene-x-near', `${x * -24}px`);
    scene.style.setProperty('--scene-y-near', `${y * -24}px`);
  });

  scene.addEventListener('pointerleave', () => {
    scene.style.backgroundPosition = '58% center';
    scene.style.setProperty('--scene-x', '0px');
    scene.style.setProperty('--scene-y', '0px');
    scene.style.setProperty('--scene-x-near', '0px');
    scene.style.setProperty('--scene-y-near', '0px');
  });
})();
