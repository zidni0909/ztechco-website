import ServiceForm from '@/components/admin/ServiceForm';

export default function CreateServicePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Service</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
