<x-app-layout>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="mb-4 text-2xl font-bold">
            MingleJS Demo
        </h1>

        

        <div class="max-w-lg pt-16 text-center text-balance">
            <p>
                While the most common use case for MingleJS is certainly not to have Livewire, Vue and React components on the same page...
            </p>
            <p class="mt-8">
                It's certainly possible to do so!
            </p>
        </div>

        <div class="mt-20 bg-white rounded-lg shadow">
            @livewire(\App\Livewire\Demo::class)
        </div>

    </div>
    @livewire(\App\Livewire\Toaster::class)
</x-app-layout>