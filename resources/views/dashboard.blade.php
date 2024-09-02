<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-lg">
                <x-skeleton id="skeleton-counter" class="w-full h-48"/>
                @livewire(\App\Livewire\Demo::class)
            </div>

            @livewire(\App\Livewire\CreateBusinessWizard::class)

        </div>
    </div>
    @livewire(\App\Livewire\Toaster::class)
</x-app-layout>
