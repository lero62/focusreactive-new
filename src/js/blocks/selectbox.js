export function selectboxes() {
  const selects = document.querySelectorAll('select.form-select');

  selects.forEach((select) => {
    if (select.closest('[data-selectbox]')) return; // Уже инициализирован

    const placeholder = select.getAttribute('data-selectbox-placeholder') || '';
    const wrapper = document.createElement('div');
    wrapper.className = 'selectbox';
    wrapper.setAttribute('data-selectbox', '');

    const headBtn = document.createElement('button');
    headBtn.type = 'button';
    headBtn.className = 'selectbox__head';
    headBtn.setAttribute('data-selectbox-head', '');

    const textSpan = document.createElement('span');
    textSpan.className = 'selectbox__text';
    textSpan.setAttribute('data-selectbox-title', placeholder);
    if (placeholder) {
      textSpan.classList.add('selectbox__placeholder');
      textSpan.textContent = placeholder;
    }

    headBtn.appendChild(textSpan);

    const drop = document.createElement('div');
    drop.className = 'selectbox__drop';

    // Переместить оригинальный select внутрь новой обертки
    const parent = select.parentElement;
    parent.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    wrapper.appendChild(headBtn);
    wrapper.appendChild(drop);
  });
}

export function setupSelectboxes() {
  const selectboxes = document.querySelectorAll('[data-selectbox]');

  selectboxes.forEach((selectbox) => {
    const select = selectbox.querySelector('select');
    const head = selectbox.querySelector('[data-selectbox-head]');
    const title = selectbox.querySelector('[data-selectbox-title]');
    const drop = selectbox.querySelector('.selectbox__drop');

    if (!drop.querySelector('ul')) {
      const ul = document.createElement('ul');
      ul.setAttribute('role', 'listbox');

      [...select.options].forEach((opt) => {
        if (opt.text.trim() === '') return;
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.setAttribute('tabindex', '-1');
        li.textContent = opt.text;

        if (opt.selected) {
          li.classList.add('_selected');
          title.textContent = opt.text;
          title.classList.remove('selectbox__placeholder');
        }

        ul.appendChild(li);
      });

      drop.appendChild(ul);

      ul.querySelectorAll('li').forEach((li) => {
        li.addEventListener('click', () => {
          const value = li.textContent;
          [...ul.children].forEach((item) => item.classList.remove('_selected'));
          li.classList.add('_selected');

          // Изменяем отображение в заголовке
          title.textContent = value;
          title.classList.remove('selectbox__placeholder');

          // Устанавливаем значение в <select>
          const matchedOption = [...select.options].find((o) => o.text === value);
          if (matchedOption) select.value = matchedOption.value;

          selectbox.classList.add('_change');
          selectbox.classList.remove('_open');

          const event = new CustomEvent('selectboxChange', { detail: { selectbox } });
          document.dispatchEvent(event);
        });

        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') li.click();
        });
      });
    }

    head.addEventListener('click', () => {
      const isOpen = selectbox.classList.contains('_open');
      document.querySelectorAll('.selectbox._open').forEach((sb) => sb.classList.remove('_open'));
      if (!isOpen) {
        selectbox.classList.add('_open');
        const event = new CustomEvent('selectboxOpen', { detail: { selectbox } });
        document.dispatchEvent(event);
      } else {
        const event = new CustomEvent('selectboxClose', { detail: { selectbox } });
        document.dispatchEvent(event);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.selectbox')) {
      document.querySelectorAll('.selectbox._open').forEach((sb) => sb.classList.remove('_open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.selectbox._open').forEach((sb) => sb.classList.remove('_open'));
    }
  });
}
