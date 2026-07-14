import PreRegistrationForm from "@/components/visitor/pre-registration"

export default function PreRegistrationPage() {
  return (
    <div className="mx-auto max-w-lg">
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
  )
}
