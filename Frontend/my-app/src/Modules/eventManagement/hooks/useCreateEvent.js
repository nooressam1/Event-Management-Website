import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, updateEvent, getEventById } from "../utils/eventService";

const INITIAL_FORM = {
  title: "",
  date: "",
  time: "",
  location: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  capacity: 100,
  enableWaitlist: false,
  allowPlusOnes: false,
  isPublic: false,
  rsvpQuestions: [],
};

const buildPayload = (formData, status) => {
  const date =
    formData.date && formData.time
      ? new Date(`${formData.date}T${formData.time}`)
      : formData.date
        ? new Date(formData.date)
        : null;

  return {
    title: formData.title,
    shortDescription: formData.shortDescription,
    description: formData.description,
    coverImage: formData.coverImage,
    date,
    time: formData.time,
    location: { address: formData.location },
    capacity: Number(formData.capacity),
    enableWaitlist: formData.enableWaitlist,
    allowPlusOnes: formData.allowPlusOnes,
    isPublic: formData.isPublic,
    rsvpQuestions: formData.rsvpQuestions,
    status,
  };
};

const validate = (step, formData) => {
  if (!formData.title.trim()) return "Event name is required.";
  if (step >= 2 && !formData.date) return "Event date is required.";
  if (step >= 2 && !formData.time) return "Event start time is required.";
  if (step >= 2 && formData.capacity < 1) return "Capacity must be at least 1.";
  return null;
};

// editEventId: when provided, pre-loads the event and uses updateEvent on save
const useCreateEvent = (editEventId = null) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(!!editEventId);

  // Pre-fill form when editing an existing event
  useEffect(() => {
    if (!editEventId) return;
    setInitializing(true);
    getEventById(editEventId)
      .then(({ event: e }) => {
        const d = new Date(e.date);
        const dateStr = d.toISOString().split("T")[0];
        const timeStr = d.toTimeString().slice(0, 5);
        setFormData({
          title: e.title ?? "",
          date: dateStr,
          time: timeStr,
          location: e.location?.address ?? "",
          shortDescription: e.shortDescription ?? "",
          description: e.description ?? "",
          coverImage: e.coverImage ?? "",
          capacity: e.capacity ?? 100,
          enableWaitlist: e.enableWaitlist ?? false,
          allowPlusOnes: e.allowPlusOnes ?? false,
          isPublic: e.isPublic ?? false,
          rsvpQuestions: e.rsvpQuestions ?? [],
        });
        setCreatedEvent(e);
      })
      .catch(() => setError("Failed to load event for editing."))
      .finally(() => setInitializing(false));
  }, [editEventId]);

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const goToStep2 = () => {
    const err = validate(1, formData);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  };

  const goToStep1 = () => {
    setError(null);
    setStep(1);
  };

  const backToStep2 = () => {
    setError(null);
    setStep(2);
  };

  const saveDraft = async () => {
    const err = validate(1, formData);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      setSaving(true);
      const payload = buildPayload(formData, "DRAFT");
      if (createdEvent) {
        await updateEvent(createdEvent._id, payload);
      } else {
        await createEvent(payload);
      }
      navigate("/myevents");
    } catch {
      setError("Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const publishAndFinish = async () => {
    const err = validate(2, formData);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    try {
      setSaving(true);
      const payload = buildPayload(formData, "PUBLISHED");
      let event;
      if (createdEvent) {
        const res = await updateEvent(createdEvent._id, payload);
        event = res.event;
      } else {
        const res = await createEvent(payload);
        event = res.event;
      }
      setCreatedEvent(event);
      setStep(3);
    } catch {
      setError("Failed to publish event.");
    } finally {
      setSaving(false);
    }
  };

  const finishAndDashboard = () => {
    if (createdEvent) {
      navigate(`/events/${createdEvent._id}`);
    } else {
      navigate("/myevents");
    }
  };

  return {
    step,
    formData,
    updateField,
    createdEvent,
    saving,
    error,
    initializing,
    goToStep1,
    goToStep2,
    backToStep2,
    saveDraft,
    publishAndFinish,
    finishAndDashboard,
  };
};

export default useCreateEvent;
