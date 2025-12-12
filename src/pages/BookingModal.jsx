import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function BookingModal({show,onClose, tour}) {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    // send to API (axios.post)
    toast.success("Booking request sent!");
    onClose();
  };
  if(!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Book: {tour.title}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name",{required:true})} placeholder="Full name" className="w-full border p-3 rounded"/>
          <input {...register("phone",{required:true})} placeholder="Phone" className="w-full border p-3 rounded"/>
          <input {...register("email")} placeholder="Email" className="w-full border p-3 rounded"/>
          <button className="w-full py-3 bg-[var(--accent)] text-white rounded">Request Booking</button>
        </form>
      </div>
    </div>
  );
}
