import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export default {
  title: 'UI/Modal',
  component: Modal,
};

export function Basic() {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Example Modal">
        Example content inside the modal.
      </Modal>
    </div>
  );
}

