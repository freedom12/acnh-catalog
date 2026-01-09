import { ref } from 'vue';

const visible = ref(false);
const position = ref({ top: '0px', left: '0px' });
const content = ref('');
const maxWidth = ref('300px');

export function useTooltip() {
  const show = (event: MouseEvent, text: string, width?: string) => {
    if (!text) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    content.value = text;
    maxWidth.value = width || '300px';
    position.value = {
      top: `${rect.top - 8}px`,
      left: `${rect.left + rect.width / 2}px`,
    };
    visible.value = true;
  };

  const hide = () => {
    visible.value = false;
  };

  return {
    visible,
    position,
    content,
    maxWidth,
    show,
    hide,
  };
}
