/**
 * WordPress dependencies
 */
import { store } from '@wordpress/interactivity';

store(
	'core/gallery',
	{
        callbacks: {
            init() {
                console.log('init gallery block');
            },
        },
	},
	{
		lock: false,
	},
);