import TestimonialForm from '@/components/admin/TestimonialForm';

export default function CreateTestimonialPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Testimonial</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
