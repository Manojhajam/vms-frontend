import PreRegistrationForm from "@/components/visitor/pre-registration"

export default function PreRegistrationPage() {
  return (
    <div className="flex min-h-screen flex-col border border-gray-600 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pre-Registration
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Fill in your details to pre-register your visit.
            </p>
          </div>
          <PreRegistrationForm />
        </div>
      </div>
    </div>
  )
}
