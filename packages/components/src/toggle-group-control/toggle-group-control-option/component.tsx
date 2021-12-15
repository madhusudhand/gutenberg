/**
 * External dependencies
 */
// eslint-disable-next-line no-restricted-imports
import type { FocusEvent, Ref } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Radio } from 'ariakit/radio';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import {
	contextConnect,
	useContextSystem,
	WordPressComponentProps,
} from '../../ui/context';
import type { ToggleGroupControlOptionProps, WithToolTipProps } from '../types';
import { useToggleGroupControlContext } from '../context';
import * as styles from './styles';
import { useCx } from '../../utils/hooks';
import Tooltip from '../../tooltip';

const { ButtonContentView, LabelPlaceholderView, LabelView } = styles;

const WithToolTip = ( { showTooltip, text, children }: WithToolTipProps ) => {
	if ( showTooltip && text ) {
		return (
			<Tooltip text={ text } position="top center">
				{ children }
			</Tooltip>
		);
	}
	return <>{ children }</>;
};

function ToggleGroupControlOption(
	props: WordPressComponentProps< ToggleGroupControlOptionProps, 'button' >,
	forwardedRef: Ref< any >
) {
	const toggleGroupControlContext = useToggleGroupControlContext();
	const id = useInstanceId(
		ToggleGroupControlOption,
		'toggle-group-control-option'
	) as string;
	const buttonProps = useContextSystem(
		{ ...props, id },
		'ToggleGroupControlOption'
	);

	const {
		className,
		isBlock = false,
		label,
		value,
		showTooltip = false,
		state,
		...radioProps
	} = {
		...toggleGroupControlContext,
		...buttonProps,
	};

	const isActive = state.value === value;
	const cx = useCx();
	const labelViewClasses = cx( isBlock && styles.labelBlock );
	const classes = cx(
		styles.buttonView,
		className,
		isActive && styles.buttonActive
	);
	const optionLabel = !! radioProps[ 'aria-label' ]
		? radioProps[ 'aria-label' ]
		: label;

	return (
		<LabelView className={ labelViewClasses } data-active={ isActive }>
			<WithToolTip showTooltip={ showTooltip } text={ optionLabel }>
				<Radio
					{ ...radioProps }
					as="button"
					onFocus={ ( event: FocusEvent< HTMLButtonElement > ) => {
						radioProps.onFocus?.( event );
						if ( event.defaultPrevented ) return;
						state.setValue( value );
					} }
					aria-label={ optionLabel }
					className={ classes }
					data-value={ value }
					ref={ forwardedRef }
					value={ value }
				>
					<ButtonContentView>{ label }</ButtonContentView>
					<LabelPlaceholderView aria-hidden>
						{ label }
					</LabelPlaceholderView>
				</Radio>
			</WithToolTip>
		</LabelView>
	);
}

/**
 * `ToggleGroupControlOption` is a form component and is meant to be used as a
 * child of `ToggleGroupControl`.
 *
 * @example
 * ```jsx
 * import {
 *   __experimentalToggleGroupControl as ToggleGroupControl,
 *   __experimentalToggleGroupControlOption as ToggleGroupControlOption,
 * } from '@wordpress/components';
 *
 * function Example() {
 *   return (
 *     <ToggleGroupControl label="my label" value="vertical" isBlock>
 *       <ToggleGroupControlOption value="horizontal" label="Horizontal" />
 *       <ToggleGroupControlOption value="vertical" label="Vertical" />
 *     </ToggleGroupControl>
 *   );
 * }
 * ```
 */
const ConnectedToggleGroupControlOption = contextConnect(
	ToggleGroupControlOption,
	'ToggleGroupControlOption'
);

export default ConnectedToggleGroupControlOption;
