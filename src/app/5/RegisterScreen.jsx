import { useThemeStore } from '../../zustand/context';
import { Text } from '../../components/Text';
import { View } from '../../components/View';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';

export default function RegisterScreen() {
  const navigatorHeight = useThemeStore((state) => state.navigatorHeight);
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ backgroundColor: '#ff1119', minHeight: '110%' }}
    >
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: '#ee1100' }}>
        <Text style={{ backgroundColor: '#aa1100' }}>Hello Register</Text>
        <Text>Hello Register</Text>
      </View>
    </ScrollView>
  );
}
