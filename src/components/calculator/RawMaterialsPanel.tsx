import { Card, Group, Stack, Table, Text, ThemeIcon } from "@mantine/core";
import { Package } from "lucide-react";
import ItemLink from "@/components/ui/ItemLink";

interface Props {
  rawMaterials: Record<string, number>;
  quantity: number;
  itemName: string;
  recipeIndex: Map<string, string>;
}

export default function RawMaterialsPanel({
  rawMaterials,
  quantity,
  itemName,
  recipeIndex,
}: Props) {
  const sorted = Object.entries(rawMaterials).sort((a, b) => b[1] - a[1]);

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <ThemeIcon variant="transparent" color="orange" size="sm">
          <Package size={16} />
        </ThemeIcon>
        <Text fw={600}>Raw Materials</Text>
        <Text size="xs" c="dimmed">
          for {quantity}× {itemName}
        </Text>
      </Group>

      <Card withBorder p={0}>
        {sorted.length === 0 ? (
          <Text size="sm" c="dimmed" p="md">
            All sub-items have recipes.
          </Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Text size="xs" c="dimmed" fw={500}>
                    Item
                  </Text>
                </Table.Th>
                <Table.Th ta="right">
                  <Text size="xs" c="dimmed" fw={500}>
                    Qty
                  </Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sorted.map(([item, qty]) => (
                <Table.Tr key={item}>
                  <Table.Td>{item.trim()}</Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" ff="monospace" c="orange">
                      {qty}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}
