import React from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Select from '../../components/ui/Select';
import FieldLabel from '../../components/ui/FieldLabel';

const SIZE_OPTIONS = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'assigned', label: 'Assigned' },
];

const BoothModals = ({
  isCreateOpen,
  onCloseCreate,
  onCreateSubmit,
  isSubmitting,
  register,
  handleSubmit,
  errors,
  watch,
  assigningBooth,
  onCloseAssign,
  onAssignSubmit,
  isAssigning,
  selectedExhibitorId,
  onSelectExhibitor,
  approvedExhibitors = [],
}) => {
  const sizeValue = watch ? watch('size') : 'small';
  const statusValue = watch ? watch('status') : 'available';
  const sizeRegister = register('size');
  const statusRegister = register('status');

  const assignOptions = [
    { value: '', label: '-- Choose Approved Exhibitor --' },
    ...approvedExhibitors.map((ex) => ({
      value: ex._id,
      label: `${ex.companyName} (${ex.userId?.email})`,
    })),
  ];

  const createModalFooter = (
    <>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onCloseCreate}
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        className="px-4 py-2 text-xs font-medium rounded-lg border hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="create-booth-form"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
      >
        {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
        {isSubmitting ? 'Creating...' : 'Create Booth'}
      </button>
    </>
  );

  const assignModalFooter = (
    <>
      <button
        type="button"
        disabled={isAssigning}
        onClick={onCloseAssign}
        style={{
          backgroundColor: 'var(--color-surface-alt)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-muted)',
        }}
        className="px-4 py-2 text-xs font-medium rounded-lg border hover:text-white transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="assign-booth-form"
        disabled={isAssigning || !selectedExhibitorId}
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg btn-primary disabled:opacity-50"
      >
        {isAssigning && <LoadingSpinner size="sm" className="mr-2" />}
        {isAssigning ? 'Assigning...' : 'Assign Exhibitor'}
      </button>
    </>
  );

  return (
    <>
      {/* Create Booth Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        title="Add Floorplan Booth"
        maxWidth="max-w-md"
        footer={createModalFooter}
      >
        <form id="create-booth-form" onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
          <div>
            <FieldLabel htmlFor="boothNumber" required>Booth Number</FieldLabel>
            <input
              id="boothNumber"
              type="text"
              placeholder="e.g. A-101"
              {...register('boothNumber')}
              style={{
                backgroundColor: 'var(--color-surface-alt)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border transition-colors placeholder:text-[var(--color-text-dim)]"
            />
            {errors.boothNumber && (
              <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.boothNumber.message}</p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="size" required>Booth Size</FieldLabel>
            <Select
              id="size"
              name={sizeRegister.name}
              value={sizeValue}
              options={SIZE_OPTIONS}
              onChange={(e) => sizeRegister.onChange(e)}
            />
            {errors.size && (
              <p style={{ color: 'var(--color-danger)' }} className="mt-1 text-xs">{errors.size.message}</p>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="status">Initial Availability Status</FieldLabel>
            <Select
              id="status"
              name={statusRegister.name}
              value={statusValue}
              options={STATUS_OPTIONS}
              onChange={(e) => statusRegister.onChange(e)}
            />
          </div>
        </form>
      </Modal>

      {/* Assign Exhibitor Modal */}
      <Modal
        isOpen={Boolean(assigningBooth)}
        onClose={onCloseAssign}
        title={`Assign Booth #${assigningBooth?.boothNumber}`}
        maxWidth="max-w-md"
        footer={assignModalFooter}
      >
        <form id="assign-booth-form" onSubmit={onAssignSubmit} className="space-y-4">
          <p style={{ color: 'var(--color-text-muted)' }} className="text-xs">
            Select an approved exhibitor company from the roster to designate this booth.
          </p>

          <div>
            <FieldLabel htmlFor="selectExhibitor" required>Approved Exhibitor</FieldLabel>
            <Select
              id="selectExhibitor"
              value={selectedExhibitorId}
              options={assignOptions}
              onChange={(e) => onSelectExhibitor(e.target.value)}
              placeholder="-- Choose Approved Exhibitor --"
            />
            {approvedExhibitors.length === 0 && (
              <p style={{ color: 'var(--color-warning)' }} className="mt-1.5 text-xs">
                No approved exhibitors currently available to assign.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BoothModals;
