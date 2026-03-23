import PortfolioForm from '@/components/admin/PortfolioForm';

export default function CreatePortfolioPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Portfolio Item</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <PortfolioForm />
      </div>
    </div>
  );
}
