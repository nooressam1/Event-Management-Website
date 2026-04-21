const DeleteConfirm = ({ onConfirm, onCancel, loading }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-OffRedbackground border border-MainRed/30 rounded-xl mb-4 text-sm">
    <span className="text-MainRed flex-1">
      This will permanently delete the event and all RSVP data. This cannot be undone.
    </span>
    <button
      onClick={onCancel}
      className="text-SecondOffWhiteText hover:text-white px-3 py-1.5 rounded-lg border border-LineBox transition-colors"
    >
      Cancel
    </button>
    <button
      onClick={onConfirm}
      disabled={loading}
      className="bg-MainRed hover:bg-red-500 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  </div>
);

export default DeleteConfirm;
