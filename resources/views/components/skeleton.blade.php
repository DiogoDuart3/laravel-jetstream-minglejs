@props(['class' => ''])

@php
    $attributes = $attributes->merge(['class' => 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded ' . $class]);
@endphp

<div {{ $attributes }}>
    {{ $slot }}
</div>
