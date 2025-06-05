
import ApiTester from '@/components/ApiTester';

const ApiTest = () => {
  return (
    <div className="min-h-screen bg-warfare-dark">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-8">API Testing Dashboard</h1>
        <ApiTester />
      </div>
    </div>
  );
};

export default ApiTest;
